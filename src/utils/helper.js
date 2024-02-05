export const getSender = (userId, users) => {
  return users[0]._id === userId ? users[1].name : users[0].name;
};

export const getUsersId = (users) => {
  let usersId = [];
  users.map((item) => usersId.push(item._id));
  return usersId;
};
