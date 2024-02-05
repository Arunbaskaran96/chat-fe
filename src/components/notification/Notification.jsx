import { ChatState } from "../../context/ChatProvider";
import classes from "./notification.module.css";

function Notification({ setIsNotification }) {
  const { notification, setCurrentChat } = ChatState();

  const currentChatHandler = (sender) => {
    setCurrentChat(sender);
    setIsNotification(false);
  };

  return (
    <div className={classes.container}>
      {notification &&
        notification.map((sender) => {
          return (
            <div
              onClick={() => currentChatHandler(sender.chat)}
              className={classes.nofify}
            >
              <h6
                className={classes.text}
              >{`New Message from ${sender.sender.name}`}</h6>
            </div>
          );
        })}
    </div>
  );
}

export default Notification;
