import { FaEye } from "react-icons/fa";
import classes from "./chatbox.module.css";
import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { ChatState } from "../../context/ChatProvider";
import { getSender } from "../../utils/helper";
import Pill from "../pill/Pill";
import { useEffect, useState } from "react";
import useDebounce from "../../hooks/useDebounce";
import useLocalStorage from "../../hooks/useLocalStorage";
import { BiLeftArrowAlt } from "react-icons/bi";

function Top() {
  const [opened, { open, close }] = useDisclosure(false);
  const { currentChat, user, setCurrentChat } = ChatState();
  const [editGroup, setEditGroup] = useState(false);
  const [chatName, setChatName] = useState("");
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const delayText = useDebounce(searchTerm);
  const { getItem } = useLocalStorage("user");
  const authUser = getItem();
  const [suggestions, setSuggestions] = useState([]);
  const [usersSet, setUserSet] = useState(new Set());
  const [deleteUserGrp, setDeleteUserGrp] = useState("");
  const [addNewUser, setAddNewUser] = useState("");

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSuggestions([]);
    } else {
      fetchUsers();
    }
  }, [delayText]);

  useEffect(() => {
    if (currentChat.isGroupChat) {
      setChatName("");
      setUsers([]);
      setUserSet(new Set());
      setChatName(currentChat.chatName);
      setUsers([...currentChat.users]);
      getUserSet();
    } else {
      setChatName("");
      setUsers([]);
      setUserSet(new Set());
    }
  }, [currentChat]);

  const getUserSet = () => {
    currentChat.users.map((item) => {
      setUserSet(usersSet.add(item._id));
    });
  };

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

  const updateGroupChat = async () => {
    try {
      const data = await fetch(
        `https://chatapi-d2fo.onrender.com/api/addgroup/${currentChat._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: authUser.token,
          },
          body: JSON.stringify({
            friendId: addNewUser,
            userId: authUser._id,
          }),
        }
      );
      const result = await data.json();
      if (result.success === false) {
      } else {
        setAddNewUser("");
        onclose();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteUser = async (item) => {
    setUsers(users.filter((user) => user._id != item._id));
    const updateUser = new Set(usersSet);
    setDeleteUserGrp(item._id);
    updateUser.delete(item._id);
    setUserSet(new Set(updateUser));
    const data = await fetch(
      `https://chatapi-d2fo.onrender.com/api/removegroup/${currentChat._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: authUser.token,
        },
        body: JSON.stringify({
          userId: authUser._id,
          // friendId: deleteUserGrp,
        }),
      }
    );
    const result = await data.json();
    if (result.success === false) {
    } else {
      setDeleteUserGrp("");
    }
  };

  const addUser = (item) => {
    setUsers([...users, item]);
    setUserSet(usersSet.add(item._id));
  };

  return (
    <div className={classes.topContainer}>
      <div onClick={() => setCurrentChat(null)} className={classes.leftArrow}>
        <BiLeftArrowAlt />
      </div>
      {currentChat?.isGroupChat === false ? (
        <h4 className={classes.sender}>
          {getSender(user._id, currentChat?.users)}
        </h4>
      ) : (
        <h4 className={classes.sender}>{currentChat?.chatName}</h4>
      )}

      <div className={classes.eyeIcon} onClick={open}>
        <FaEye />
      </div>
      {currentChat.isGroupChat === false && (
        <Modal opened={opened} onClose={close} withCloseButton={false}>
          {currentChat.users
            .filter((item) => item._id != user._id)
            .map((user) => {
              return (
                <div key={user._id} className={classes.modaluser}>
                  <img className={classes.img} src={user.pic} />
                  <h6 className={classes.userName}>{user.name}</h6>
                  <p className={classes.userEmail}>{user.email}</p>
                </div>
              );
            })}
        </Modal>
      )}
      {currentChat.isGroupChat === true && (
        <Modal opened={opened} onClose={close} withCloseButton={false}>
          {editGroup ? (
            <div className={classes.ediModal}>
              <div>
                <h6 style={{ fontSize: "20px" }}>Chat Name</h6>
                <input className={classes.editInput} defaultValue={chatName} />
              </div>
              <h6 style={{ fontSize: "20px" }}>Users</h6>
              <div className={classes.users}>
                {users.map((item) => {
                  return (
                    <div key={item._id}>
                      <Pill item={item} deleteUser={deleteUser} />
                    </div>
                  );
                })}
              </div>
              <h6 style={{ fontSize: "20px" }}>Select Users</h6>
              <div>
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={classes.editInput}
                />
              </div>
              <div>
                <button
                  onClick={updateGroupChat}
                  className={classes.updateGroup}
                >
                  Update Group
                </button>
              </div>
              {suggestions && suggestions.length > 0 ? (
                <div className={classes.suggestionContainer}>
                  {suggestions.map((item) => {
                    return (
                      !usersSet.has(item._id) && (
                        <div
                          key={item._id}
                          className={classes.editUser}
                          onClick={() => addUser(item)}
                        >
                          <div>
                            <img
                              className={classes.editUserImage}
                              src={item.pic}
                              alt="pic"
                            />
                          </div>
                          <div>
                            <h6>{item.name}</h6>
                            <p>{item.email}</p>
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
          ) : (
            <div className={classes.groupModal}>
              <h5 className={classes.chatName}>{currentChat.chatName}</h5>
              <div className={classes.users}>
                {currentChat.users.map((item) => {
                  return (
                    <div key={item._id}>
                      <Pill item={item} />
                    </div>
                  );
                })}
              </div>
              <div>
                <button
                  onClick={() => setEditGroup(true)}
                  className={classes.editBtn}
                >
                  Edit Group
                </button>
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}

export default Top;
