import classNames from "classnames";
import classes from "./chat.module.css";
import { useEffect, useRef } from "react";
import { ChatState } from "../../context/ChatProvider";

export default function Chat({ item, user, id }) {
  const { setNotification, notification, currentChat } = ChatState();
  const messageRef = useRef();

  useEffect(() => {
    const rest = notification.filter(
      (item) => item.chat._id != currentChat._id
    );
    setNotification(rest);
  }, []);
  useEffect(() => {
    messageRef.current.scrollIntoView({ behavior: "smooth" });
  }, []);
  return (
    <div
      className={classNames(
        classes.container,
        user?._id === item.sender._id && classes.own
      )}
      ref={messageRef}
      key={id}
    >
      {user?._id != item.sender._id && (
        <img className={classes.image} src={item.sender.pic} alt="profilepic" />
      )}
      <p className={classes.msg}>{item.content}</p>
    </div>
  );
}
