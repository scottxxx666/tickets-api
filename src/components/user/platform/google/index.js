const { getValidUserInfo } = require('./api');

const getUserInput = async (token) => {
  const { openId, payload } = await getValidUserInfo(token);
  return toUserInput(openId, payload);
};

function toUserInput(openId, payload) {
  const userInput = {
    name: payload.name,
    openIds: [{ platform: 'GOOGLE', openId: openId }],
  };

  if (payload.email && payload.email_verified) {
    userInput.email = payload.email;
  }
  return userInput;
}

const getOpenId = async (token) => {
  const { openId } = await getValidUserInfo(token);
  return openId;
};

module.exports = { getUserInput, getOpenId };
