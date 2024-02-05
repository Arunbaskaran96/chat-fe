import { useDisclosure } from "@mantine/hooks";
import classes from "./dropdown.module.css";
import { Modal } from "@mantine/core";
import "@mantine/core/styles.css";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "../../hooks/useLocalStorage";
import { ChatState } from "../../context/ChatProvider";

export default function Dropdown() {
  const [opened, { open, close }] = useDisclosure(false);
  const navigate = useNavigate();
  const { setUser, setCurrentChat, user } = ChatState();
  const { removeItem } = useLocalStorage("user");
  const logoutHandler = () => {
    removeItem();
    setUser(null);
    setCurrentChat(null);
    navigate("/");
  };
  return (
    <>
      <div className={classes.dropdown}>
        <p onClick={open}>My Profile</p>
        <hr />
        <p onClick={logoutHandler}>Logout</p>
      </div>
      <Modal opened={opened} onClose={close} title="Profile">
        <div style={{ textAlign: "center" }}>
          <img
            className={classes.image}
            src="https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
            alt="profilepic"
          />
          <div className={classes.profile}>
            <p>{user?.name}</p>
            <p>{user?.email}</p>
          </div>
        </div>
      </Modal>
    </>
  );
}
