import { Modal } from "@mantine/core";
import { ChatState } from "../../context/ChatProvider";
import { getSender, getUsersId } from "../../utils/helper";
import classes from "./message.module.css";
import { FaEye } from "react-icons/fa";
import { useDisclosure } from "@mantine/hooks";
import "@mantine/core/styles.css";
import Pill from "../pill/Pill";
import { useEffect, useState } from "react";
import useDebounce from "../../hooks/useDebounce";
import useLocalStorage from "../../hooks/useLocalStorage";
import Chat from "../chat/Chat";
import Loading from "../loading/Loading";
import { io } from "socket.io-client";

const END_POINT = "http://localhost:8000";
var socket, selectedChatCompare;

export default function Message() {
  const { user, currentChat, notification, setNotification } = ChatState();
  const [opened, { open, close }] = useDisclosure(false);
  const [chatName, setChatName] = useState("");
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const delayText = useDebounce(searchTerm);
  const { getItem } = useLocalStorage("user");
  const authUser = getItem();
  const [suggestions, setSuggestions] = useState([]);
  const [usersSet, setUserSet] = useState(new Set());
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIstyping] = useState(false);
  const [addNewUser, setAddNewUser] = useState("");
  const [deleteUserGrp, setDeleteUserGrp] = useState("");

  useEffect(() => {
    if (currentChat.isGroupChat) {
      setChatName(currentChat.chatName);
      setUsers([...currentChat.users]);
      getUserSet();
    } else {
      setChatName("");
      setUsers([]);
      setUserSet(new Set());
    }
  }, [currentChat]);

  const getUserSet = () => {
    currentChat.users.map((item) => {
      setUserSet(usersSet.add(item._id));
    });
  };

  useEffect(() => {
    if (currentChat != null) {
      socket = io(END_POINT);
      socket.emit("setup", user);
      socket.on("connected", setSocketConnected(true));
      socket.emit("typing", () => setIstyping(true));
      socket.emit("stop typing", () => setIstyping(false));
    }
  }, []);

  useEffect(() => {
    if (message.trim === "") {
      setMessage([]);
    } else {
      const getMessages = async () => {
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
    }
  }, [currentChat]);

  useEffect(() => {
    socket.on("message recieved", (newMsg) => {
      if (!selectedChatCompare && selectedChatCompare._id != newMsg._id) {
        const isExists = notification.filter(
          (item) => item.chat._id === newMsg.chat._id
        );
        if (isExists.length === 0) {
          setNotification([...notification, newMsg]);
        }
      } else {
        setMessages([...messages, newMsg]);
      }
    });
  });

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSuggestions([]);
    } else {
      fetchUsers();
    }
  }, [delayText]);

  const fetchUsers = async () => {
    try {
      const data = await fetch(
        `http://localhost:8000/api/search?email=${searchTerm}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: authUser.token,
          },
        }
      );
      const result = await data.json();
      if (result.success === false) {
      } else {
        setSuggestions(result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addUser = (item) => {
    setUsers([...users, item]);
    setUserSet(new Set([...usersSet, item._id]));
  };

  const deleteUser = async (item) => {
    setUsers(users.filter((user) => user._id != item._id));
    const updateUser = new Set(usersSet);
    setDeleteUserGrp(item._id);
    updateUser.delete(item._id);
    setUserSet(new Set(updateUser));
    const data = await fetch(
      `http://localhost:8000/api/removegroup/${currentChat._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: authUser.token,
        },
        body: JSON.stringify({
          userId: authUser._id,
          friendId: deleteUserGrp,
        }),
      }
    );
    const result = await data.json();
    if (result.success === false) {
    } else {
      setDeleteUserGrp("");
    }
  };

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
        socket.emit("new message", result);
        setMessages([...messages, result]);
      }
    }
  };

  const changeHandler = (e) => {
    setMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", currentChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", currentChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const updateGroupChat = async () => {
    try {
      const data = await fetch(
        `http://localhost:8000/api/addgroup/${currentChat._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: authUser.token,
          },
          body: JSON.stringify({
            friendId: addNewUser,
            userId: authUser._id,
          }),
        }
      );
      const result = await data.json();
      if (result.success === false) {
      } else {
        setAddNewUser("");
        onclose();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return loading ? (
    <Loading />
  ) : (
    <div className={classes.container}>
      <div className={classes.top}>
        {currentChat?.isGroupChat === false ? (
          <h5 className={classes.name}>
            {getSender(user._id, currentChat?.users)}
          </h5>
        ) : (
          <h5 className={classes.name}>{currentChat?.chatName}</h5>
        )}
        <FaEye onClick={open} size={24} style={{ cursor: "pointer" }} />
      </div>
      <hr />
      <div className={classes.middle}>
        {messages.length > 0 ? (
          messages.map((item) => {
            return (
              <div key={item._id}>
                <Chat istyping={istyping} user={user} item={item} />
              </div>
            );
          })
        ) : (
          <div></div>
        )}
      </div>
      {istyping && <p>Loading...</p>}
      <div className={classes.bottom}>
        <input
          value={message}
          onChange={changeHandler}
          className={classes.input}
          type="text"
          placeholder="type something..."
          onKeyDown={sendmsgHandler}
        />
      </div>
      {currentChat?.isGroupChat === false && (
        <Modal opened={opened} onClose={close} withCloseButton={false}>
          {currentChat.users
            .filter((item) => item._id != user._id)
            .map((item) => {
              return (
                <div key={item._id} style={{ textAlign: "center" }}>
                  <div>
                    <img
                      className={classes.profileImage}
                      src={item.pic}
                      alt="profilepic"
                    />
                  </div>
                  <div>
                    <h5>{item.name}</h5>
                    <p>{item.email}</p>
                  </div>
                </div>
              );
            })}
        </Modal>
      )}
      {currentChat?.isGroupChat === true && (
        <Modal opened={opened} onClose={close} withCloseButton={false}>
          <div>
            <div>
              <label className={classes.label}>Chat Name</label>
              <input
                value={chatName}
                className={classes.nameinput}
                type="text"
              />
            </div>
            <div className={classes.users}>
              {users.map((item) => {
                return (
                  <div key={item._id}>
                    <Pill item={item} deleteUser={deleteUser} />
                  </div>
                );
              })}
            </div>
            <div className={classes.inputContainer}>
              <input
                defaultValue={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                type="text"
                placeholder="Search Users"
                className={classes.input2}
              />
              {suggestions && suggestions.length > 0 ? (
                <div className={classes.suggestionContainer}>
                  {suggestions.map((item) => {
                    return (
                      !usersSet.has(item._id) && (
                        <div
                          key={item._id}
                          className={classes.user}
                          onClick={() => addUser(item)}
                        >
                          <div>
                            <img
                              className={classes.image}
                              src={item.pic}
                              alt="pic"
                            />
                          </div>
                          <div>
                            <h6>{item.name}</h6>
                            <p>{item.email}</p>
                          </div>
                        </div>
                      )
                    );
                  })}
                </div>
              ) : (
                <></>
              )}
            </div>
            <div className={classes.btnContainer}>
              <button onClick={updateGroupChat} className={classes.btn}>
                Update
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
