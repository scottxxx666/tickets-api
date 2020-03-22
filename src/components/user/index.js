const jwt = require('jsonwebtoken');
const { createUser, findUserByOpenId } = require('./user-repository');
const { retrieveUser, retrieveOpenId } = require('./social/google');

function generateToken(user) {
  return jwt.sign({
    user: { id: user.id },
  }, process.env.SECRET_KEY, { expiresIn: '3d' });
}

const signUp = async (_, args) => {
  const userInput = await retrieveUser(args.token);
  const user = await createUser(userInput);
  return {
    token: generateToken(user),
    user,
  };
};

const login = async (_, args, context) => {
  const openId = await retrieveOpenId(args.token);
  const user = await findUserByOpenId(openId);
  return {
    token: generateToken(user),
    user,
  };
};

module.exports = { signUp, login };
