const { getValidUserInfo } = require('./api');

const getOpenIdAndUserInput = async (token) => {
  const { openId, payload } = await getValidUserInfo(token);
  return { openId, userInput: toUserInput(openId, payload) };
};

function toUserInput(openId, payload) {
  return {
    name: payload.name,
    openIds: [{ platform: 'GOOGLE', openId: openId }],
    email: getEmail(payload),
  };
}

function getEmail(payload) {
  if (payload.email && payload.email_verified) {
    return payload.email;
  }
  return null;
}

const getOpenId = async (token) => {
  const { openId } = await getValidUserInfo(token);
  return openId;
};

module.exports = { getOpenIdAndUserInput, getOpenId };
