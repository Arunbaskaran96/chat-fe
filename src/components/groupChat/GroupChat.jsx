import { useDisclosure } from "@mantine/hooks";
import React, { useEffect, useState } from "react";
import "@mantine/core/styles.css";
import { FaPlus } from "react-icons/fa";
import { Modal } from "@mantine/core";
import classes from "./groupchat.module.css";
import useDebounce from "../../hooks/useDebounce";
import useLocalStorage from "../../hooks/useLocalStorage";
import { ChatState } from "../../context/ChatProvider";
import Pill from "../pill/Pill";
import { getUsersId } from "../../utils/helper";
export default function GroupChat() {
  const [opened, { open, close }] = useDisclosure(false);
  const [suggestions, setSuggestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const delayText = useDebounce(searchTerm);
  const { getItem } = useLocalStorage("user");
  const authUser = getItem();
  const [users, setUsers] = useState([]);
  const [usersSet, setUserSet] = useState(new Set());
  const { setCurrentChat } = ChatState();
  const [chatName, setChatName] = useState("");

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
        `https://chatapi-d2fo.onrender.com/api/search?email=${searchTerm}`,
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

  const deleteUser = (item) => {
    setUsers(users.filter((user) => user._id != item._id));
    const updateUser = new Set(usersSet);
    updateUser.delete(item._id);
    setUserSet(new Set(updateUser));
  };

  const groupHandler = async () => {
    try {
      const usersId = getUsersId(users);
      const data = await fetch(
        `https://chatapi-d2fo.onrender.com/api/groupchat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: authUser.token,
          },
          body: JSON.stringify({
            users: usersId,
            chatName: chatName,
          }),
        }
      );
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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          cursor: "pointer",
          borderRadius: "5px",
        }}
        onClick={open}
      >
        <button style={{ cursor: "pointer" }}>New Group Chat</button>
        <span style={{ marginTop: "5px" }}>
          <FaPlus />
        </span>
      </div>
      <Modal
        classNames={{ body: classes.modal }}
        opened={opened}
        onClose={close}
        withCloseButton={false}
      >
        <div className={classes.modalContainer}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <h3 className={classes.header}>Create Group Chat</h3>
            <button onClick={groupHandler} className={classes.btn}>
              Create
            </button>
          </div>
          <div>
            <input
              className={classes.nameInput}
              placeholder="Group Name"
              type="text"
              required
              onChange={(e) => setChatName(e.target.value)}
            />
          </div>
        </div>
        {users.length > 0 && (
          <div className={classes.pillContainer}>
            {users.map((item) => {
              return (
                <div key={item._id}>
                  <Pill deleteUser={deleteUser} item={item} />
                </div>
              );
            })}
          </div>
        )}
        <div className={classes.inputContainer}>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            placeholder="Search Users"
            className={classes.input}
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
                        <h6 className={classes.name}>{item.name}</h6>
                        <p className={classes.email}>{item.email}</p>
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
      </Modal>
    </>
  );
}
