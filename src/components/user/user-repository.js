const User = require('./user');

const createUser = (userInput) => {
  return User.create(userInput);
};

const getUserByOpenId = (openId) => {
  return User.findOne({ 'openIds.platform': 'GOOGLE', 'openIds.openId': openId });
};

module.exports = { createUser, getUserByOpenId };
