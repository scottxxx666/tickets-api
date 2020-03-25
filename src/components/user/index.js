const jwt = require('jsonwebtoken');
const { createUser, getUserByOpenId } = require('./user-repository');
const { getUserInput, getOpenId } = require('./platform/google');
const Token = require('./token');

const signUp = async (_, args) => {
  const userInput = await getUserInput(args.token);
  const user = await createUser(userInput);
  return {
    token: Token.generate(user),
    user,
  };
};

const login = async (_, args) => {
  const openId = await getOpenId(args.token);
  const user = await getUserByOpenId(openId);
  return {
    token: Token.generate(user),
    user,
  };
};

module.exports = { signUp, login, decodeToken: Token.decode };
