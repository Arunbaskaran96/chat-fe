import React from "react";
import classes from "./chat.module.css";
import Header from "../../components/header/Header";
import MyChats from "../../components/mychats/MyChats";
import { ChatState } from "../../context/ChatProvider";
import NoConversation from "../../components/noconversation/NoConversation";
import Chatbox from "../../components/ChatBox/Chatbox";
import classNames from "classnames";

export default function Chat() {
  const { currentChat } = ChatState();

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <Header />
      </div>
      <div className={classes.chatContainer}>
        <div
          className={classNames(
            classes.left,
            currentChat && classes.leftMobile
          )}
        >
          <MyChats />
        </div>
        <div
          className={classNames(
            classes.right,
            !currentChat && classes.rightMobile
          )}
        >
          {currentChat ? <Chatbox /> : <NoConversation />}
        </div>
      </div>
    </div>
  );
}
