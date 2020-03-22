const { OAuth2Client } = require('google-auth-library');

const clientId = process.env.GOOGLE_CLIENT_ID;

const getUserInput = async (token) => {
  const { openId, payload } = await getValidUserInfo(token);
  return toUserInput(openId, payload);
};

async function getValidUserInfo(token) {
  const { openId, payload } = await retrieveUserInfo(token);
  validate(payload);
  return { openId, payload };
}

async function retrieveUserInfo(token) {
  const client = new OAuth2Client(clientId);
  const ticket = await client.verifyIdToken({ idToken: token });
  return {
    openId: ticket.getUserId(),
    payload: ticket.getPayload(),
  };
}

function validate(payload) {
  if (payload.aud !== clientId) {
    throw new Error('Auth error!');
  }
}

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
