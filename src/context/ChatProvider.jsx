import { createContext, useContext, useEffect, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [notification, setNotification] = useState([]);

  useEffect(() => {
    if (user === null) {
      setUser(JSON.parse(window.localStorage.getItem("user")));
    }
  }, [user]);

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        currentChat,
        setCurrentChat,
        chats,
        setChats,
        setNotification,
        notification,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
