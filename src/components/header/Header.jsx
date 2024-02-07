import React, { useState } from "react";
import classes from "./header.module.css";
import { IoIosNotifications } from "react-icons/io";
import { IoIosArrowDropdown } from "react-icons/io";
import Dropdown from "../dropdown/Dropdown";
import XDrawer from "../drawer/Drawer";
import { ChatState } from "../../context/ChatProvider";
import Notification from "../notification/Notification";
import { CiLight } from "react-icons/ci";
import { MdDarkMode } from "react-icons/md";
import { useTheme } from "../../context/ThemeProvider";

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [isNotification, setIsNotification] = useState(false);
  const { notification, user } = ChatState();
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
          <div onClick={toggleTheme} className={classes.themeIcon}>
            {theme === "dark" ? <CiLight /> : <MdDarkMode />}
          </div>
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
              src={user?.pic}
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
