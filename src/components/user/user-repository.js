const User = require('./user');

const createUser = (userInput) => {
  return User.create(userInput);
};

const findUserByOpenId = (id) => {
  return User.findOne({ 'openIds.platform': 'GOOGLE', 'openIds.openId': id });
};

module.exports = { createUser, findUserByOpenId };
