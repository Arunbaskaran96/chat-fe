import classes from "./drawer.module.css";
import { CiSearch } from "react-icons/ci";
import { useDisclosure } from "@mantine/hooks";
import { Drawer } from "@mantine/core";
import "@mantine/core/styles.css";
import { useEffect, useState } from "react";
import useDebounce from "../../hooks/useDebounce";
import { ChatState } from "../../context/ChatProvider";
import useLocalStorage from "../../hooks/useLocalStorage";

export default function XDrawer() {
  const [opened, { open, close }] = useDisclosure(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const value = useDebounce(searchTerm);
  const { getItem } = useLocalStorage("user");
  const authUser = getItem();
  const { user, currentChat, setCurrentChat } = ChatState();

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setUsers([]);
    } else {
      fetchUsers();
    }
  }, [value]);

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
        setUsers(result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clickHandler = async (item) => {
    try {
      const data = await fetch(`http://localhost:8000/api/accesschat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authUser.token,
        },
        body: JSON.stringify({ userId: item._id }),
      });
      const result = await data.json();
      if (result.success === false) {
      } else {
        setCurrentChat(result);
        close();
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div onClick={open} className={classes.searchContainer}>
        <CiSearch />
        <p>Search User</p>
      </div>
      <Drawer size="xs" opened={opened} onClose={close} withCloseButton={false}>
        <div className={classes.container}>
          <div className={classes.top}>
            <h5>Search Users</h5>
          </div>
          <div className={classes.middle}>
            <input
              onChange={handleChange}
              placeholder="Search"
              type="text"
              className={classes.input}
            />
          </div>
          <hr />
          <div className={classes.bottom}>
            {users && <p>Results : {users.length}</p>}
            {users &&
              users.map((item) => {
                return (
                  <div
                    key={item._id}
                    onClick={() => clickHandler(item)}
                    className={classes.user}
                  >
                    <img className={classes.img} src={item.pic} alt="profile" />
                    <div>
                      <p className={classes.name}>{item.name}</p>
                      <p className={classes.email}>
                        Email : <span>{item.email}</span>
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </Drawer>
    </>
  );
}
