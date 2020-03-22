const jwt = require('jsonwebtoken');
const { createUser, getUserByOpenId } = require('./user-repository');
const { getUserInput, getOpenId } = require('./social/google');

function generateToken(user) {
  return jwt.sign({
    user: { id: user.id },
  }, process.env.SECRET_KEY, { expiresIn: '3d' });
}

const signUp = async (_, args) => {
  const userInput = await getUserInput(args.token);
  const user = await createUser(userInput);
  return {
    token: generateToken(user),
    user,
  };
};

const login = async (_, args, context) => {
  const openId = await getOpenId(args.token);
  const user = await getUserByOpenId(openId);
  return {
    token: generateToken(user),
    user,
  };
};

module.exports = { signUp, login };
