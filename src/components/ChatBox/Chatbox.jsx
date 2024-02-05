import Top from "./Top";
import classes from "./chatbox.module.css";
import { ChatState } from "../../context/ChatProvider";
import { useEffect, useRef, useState } from "react";
import useLocalStorage from "../../hooks/useLocalStorage";
import Chat from "../chat/Chat";
import { io } from "socket.io-client";

const END_POINT = "http://localhost:8000";
var socket, selectedChatCompare;
export default function Chatbox() {
  const { currentChat, user, notification, setNotification } = ChatState();
  const { getItem } = useLocalStorage("user");
  const authUser = getItem();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (currentChat != null) {
      socket = io(END_POINT);
      socket.emit("setup user", user._id);
      socket.on("typing", () => setIsTyping(true));
      socket.on("stop typing", () => setIsTyping(false));
      socket.on("connected", () => setSocketConnected(true));
    }
  }, []);

  useEffect(() => {
    socket.on("receive msg", (newMsg) => {
      if (selectedChatCompare._id === newMsg.chat._id) {
        setMessages([...messages, newMsg]);
      } else {
        setMessages([...messages]);
        const isExists = notification.filter(
          (item) => item.chat._id === newMsg.chat._id
        );
        if (isExists.length === 0) {
          setNotification([...notification, newMsg]);
        }
      }
    });
  });

  useEffect(() => {
    const getMessages = async () => {
      setMessages([]);
      setLoading(true);
      try {
        const data = await fetch(
          `http://localhost:8000/api/getMsg/${currentChat._id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: authUser.token,
            },
          }
        );
        const result = await data.json();
        if (data.success === false) {
        } else {
          setMessages(result);
          socket.emit("join chat", currentChat._id);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getMessages();
    selectedChatCompare = currentChat;
  }, [currentChat]);

  const sendmsgHandler = async (e) => {
    if (e.key === "Enter") {
      setMessage("");
      const data = await fetch(`http://localhost:8000/api/sendmsg`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authUser.token,
        },
        body: JSON.stringify({
          chatId: currentChat._id,
          content: message,
        }),
      });
      const result = await data.json();
      if (result.success === false) {
      } else {
        setMessages([...messages, result]);
        socket.emit("send message", result);
        socket.emit("new message", result);
        setMessages([...messages, result]);
      }
    }
  };

  const messageHandler = (e) => {
    setMessage(e.target.value);
    if (!socketConnected) {
      return;
    }
    if (!typing) {
      setTyping(true);
      socket.emit("typing", currentChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 5000;
    setTimeout(() => {
      var timenow = new Date().getTime();
      var timeDiff = timenow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", currentChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <div className={classes.container}>
      <div className={classes.top}>
        <Top />
      </div>
      <div className={classes.middle}>
        {loading && <h5>Loading...</h5>}
        <div className={classes.middleContainer}>
          {messages.length > 0 ? (
            messages.map((item) => {
              return (
                <>
                  <div>
                    <Chat id={item._id} user={user} item={item} />
                  </div>
                </>
              );
            })
          ) : (
            <div></div>
          )}
          {isTyping && (
            <div className={classes.typing}>
              <p>Typing....</p>
            </div>
          )}
        </div>
      </div>
      <div className={classes.bottom}>
        <div className={classes.bottomInputContainer}>
          <input
            type="text"
            placeholder="Type here..."
            className={classes.bottomInput}
            onChange={messageHandler}
            onKeyDown={sendmsgHandler}
            value={message}
          />
        </div>
      </div>
    </div>
  );
}
