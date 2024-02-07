export const getSender = (userId, users) => {
  return users[0]._id === userId ? users[1].name : users[0].name;
};

export const getUsersId = (users) => {
  let usersId = [];
  users.map((item) => usersId.push(item._id));
  return usersId;
};

export const changeCapital = (name) => {
  let str = name.split("");
  str = str[0].toUpperCase();
  return str.join("");
};

export const getSenderDetails = (users, userId) => {
  return users.filter((item) => item._id != userId);
};
