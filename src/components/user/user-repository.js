const User = require('./user');

const createUser = (userInput) => {
  return User.create(userInput);
};

const findUser = (id) => {
  return User.findOne({ 'openIds.platform': 'GOOGLE', 'openIds.openId': id });
};

module.exports = { createUser, findUser };
