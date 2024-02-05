import React, { useState } from "react";
import classes from "./header.module.css";
import { IoIosNotifications } from "react-icons/io";
import { IoIosArrowDropdown } from "react-icons/io";
import Dropdown from "../dropdown/Dropdown";
import XDrawer from "../drawer/Drawer";
import { ChatState } from "../../context/ChatProvider";
import Notification from "../notification/Notification";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [isNotification, setIsNotification] = useState(false);
  const { notification } = ChatState();
  const clickHandler = () => {
    setOpen(!open);
  };

  return (
    <div className={classes.headerContainer}>
      <div className={classes.container}>
        <XDrawer />
        <div className={classes.nameContainer}>
          <h4 className={classes.name}>Chat-Web</h4>
        </div>
        <div className={classes.profileContainer}>
          <div
            className={classes.notification}
            onClick={() => setIsNotification(!isNotification)}
          >
            <IoIosNotifications size="30" />
            {notification.length > 0 && (
              <span className={classes.notificationCount}>
                {notification.length}
              </span>
            )}
          </div>
          <div className={classes.profile}>
            <img
              src="https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
              alt="profilepic"
              className={classes.profilePic}
            />
            <IoIosArrowDropdown
              onClick={clickHandler}
              style={{ cursor: "pointer" }}
              size="20"
            />
          </div>
        </div>
      </div>
      {open && <Dropdown />}
      {isNotification && (
        <div style={{ position: "absolute", right: "0" }}>
          <Notification setIsNotification={setIsNotification} />
        </div>
      )}
    </div>
  );
}
