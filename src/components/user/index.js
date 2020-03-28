const { getOpenIdAndUserInput, getOpenId } = require('./platform/google');
const Token = require('./token');
const DuplicateError = require('./error/duplicate-error');
const NotFoundError = require('./error/not-found-error');

async function checkDuplicate(openId, dataSources) {
  const existed = await dataSources.userOpenIdLoader.load(openId);
  if (existed) {
    throw new DuplicateError('User already exists');
  }
}

const signUp = async (_, args, { dataSources }) => {
  const { openId, userInput } = await getOpenIdAndUserInput(args.token);
  await checkDuplicate(openId, dataSources);
  const user = await dataSources.userRepo.createUser(userInput);
  return {
    token: Token.generate(user),
    user,
  };
};

const login = async (_, args, { dataSources }) => {
  const openId = await getOpenId(args.token);
  const user = await dataSources.userOpenIdLoader.load(openId);
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
