const { createUser, getUserByOpenId } = require('./user-repository');
const { getOpenIdAndUserInput, getOpenId } = require('./platform/google');
const Token = require('./token');
const DuplicateError = require('./error/duplicate-error');
const NotFoundError = require('./error/not-found-error');

async function checkDuplicate(openId) {
  const existed = await getUserByOpenId(openId);
  if (existed) {
    throw new DuplicateError('User already exists');
  }
}

const signUp = async (_, args) => {
  const { openId, userInput } = await getOpenIdAndUserInput(args.token);
  await checkDuplicate(openId);
  const user = await createUser(userInput);
  return {
    token: Token.generate(user),
    user,
  };
};

const login = async (_, args) => {
  const openId = await getOpenId(args.token);
  const user = await getUserByOpenId(openId);
  checkExists(user);
  return {
    token: Token.generate(user),
    user,
  };
};

function checkExists(user) {
  if (!user) {
    throw new NotFoundError('User not found');
  }
}

module.exports = { signUp, login, decodeToken: Token.decode };
