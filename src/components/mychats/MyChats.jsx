import { useEffect } from "react";
import classes from "./mychats.module.css";
import useLocalStorage from "../../hooks/useLocalStorage";
import { ChatState } from "../../context/ChatProvider";
import { getSender } from "../../utils/helper";
import classNames from "classnames";
import GroupChat from "../groupChat/GroupChat";

export default function MyChats() {
  const { user, chats, setChats } = ChatState();
  const { getItem } = useLocalStorage("user");
  const authUser = getItem();
  const { currentChat, setCurrentChat } = ChatState();

  useEffect(() => {
    getChats();
  }, [currentChat]);

  const getChats = async () => {
    try {
      const data = await fetch(
        `https://chatapi-d2fo.onrender.com/api/fetchchats`,
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
        setChats(result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const setCurrentChatHandler = (item) => {
    setCurrentChat(item);
  };
  return (
    <div className={classes.container}>
      <div className={classes.top}>
        <h6>My Chats</h6>
        <GroupChat />
      </div>
      <hr />
      <div className={classes.bottom}>
        {chats && chats.length > 0 ? (
          chats.map((chat) => {
            return (
              <div
                className={classNames(
                  classes.user,
                  currentChat &&
                    currentChat._id === chat._id &&
                    classes.currentChat
                )}
                key={chat._id}
                onClick={() => setCurrentChatHandler(chat)}
              >
                <p className={classes.name}>
                  {chat?.isGroupChat && user
                    ? chat.chatName
                    : getSender(user?._id, chat.users)}
                </p>
                {chat.latestMessage && (
                  <p className={classes.msg}>
                    {chat.latestMessage?.sender._id === user._id
                      ? "you"
                      : chat.latestMessage?.sender.name}{" "}
                    <span> : </span>
                    <span>{chat.latestMessage?.content}</span>
                  </p>
                )}
              </div>
            );
          })
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}
