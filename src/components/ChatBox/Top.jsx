import { FaEye } from "react-icons/fa";
import classes from "./chatbox.module.css";
import { Drawer, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { ChatState } from "../../context/ChatProvider";
import { getSender, getSenderDetails } from "../../utils/helper";
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
  const [senderDetails, setSenderDetail] = useState([]);

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

  useEffect(() => {
    setSenderDetail(getSenderDetails(currentChat.users, authUser._id));
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
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteUser = async (item) => {
    setUsers(users.filter((user) => user._id != item._id));
    const updateUser = new Set(usersSet);
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
    }
  };

  const addUser = (item) => {
    setUsers([...users, item]);
    setUserSet(usersSet.add(item._id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await fetch(
      `https://chatapi-d2fo.onrender.com/api/groupchatedit/${currentChat._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: authUser.token,
        },
        body: JSON.stringify({ chatName: chatName, users: users }),
      }
    );
    const result = await data.json();
    if (result.success === false) {
    } else {
      setCurrentChat(result);
      setEditGroup(true);
      close();
    }
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
        <Drawer
          position="right"
          opened={opened}
          onClose={close}
          overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
          withCloseButton={false}
          classNames={{ body: classes.drawer }}
        >
          {currentChat.users
            .filter((item) => item._id != user._id)
            .map((user) => {
              return (
                <div className={classes.userContainer}>
                  <img
                    className={classes.img}
                    src={user.pic}
                    alt={senderDetails[0]?.pic}
                  />
                  <h3 className={classes.userName}>
                    Name : <span>{senderDetails[0]?.name}</span>
                  </h3>
                  <h5 className={classes.userEmail}>
                    Email : <span>{senderDetails[0]?.email}</span>
                  </h5>
                </div>
              );
            })}
        </Drawer>
      )}

      {currentChat.isGroupChat === true && (
        <Drawer
          position="right"
          opened={opened}
          onClose={close}
          overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
          withCloseButton={false}
          classNames={{ body: classes.drawer }}
        >
          {!editGroup ? (
            <>
              <div className={classes.chatNameContainer}>
                <h3 className={classes.chatname}>{currentChat.chatName}</h3>
              </div>
              <div>
                <h5 className={classes.members}>Members</h5>
              </div>
              <div>
                {currentChat.users.map((item) => {
                  return (
                    <div key={item._id} className={classes.user}>
                      <img
                        className={classes.userpicture}
                        src={item.pic}
                        alt="userpic"
                      />
                      <h5 className={classes.groupusername}>
                        {user._id === item._id ? "you" : item.name}
                      </h5>
                    </div>
                  );
                })}
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <button
                  onClick={() => setEditGroup(true)}
                  className={classes.editGrpBtn}
                >
                  Edit
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleSubmit}>
              <div>
                <h6 style={{ fontSize: "20px" }}>Chat Name</h6>
                <div className={classes.editInputContainer}>
                  <input
                    className={classes.editInput}
                    defaultValue={chatName}
                    onChange={(e) => setChatName(e.target.value)}
                  />
                </div>
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
              <div className={classes.editInputContainer}>
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
            </form>
          )}
        </Drawer>
      )}
    </div>
  );
}

export default Top;
