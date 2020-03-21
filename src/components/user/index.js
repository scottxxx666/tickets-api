const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const { createUser, findUser } = require('./user-repository');

const clientId = process.env.GOOGLE_CLIENT_ID;

function generateToken(user) {
  return jwt.sign({
    user: { id: user.id },
  }, process.env.SECRET_KEY, { expiresIn: '3d' });
}

async function retrieveUserInfo(token) {
  const client = new OAuth2Client(clientId);
  const ticket = await client.verifyIdToken({ idToken: token });
  const openId = ticket.getUserId();
  const payload = ticket.getPayload();
  return { openId, payload };
}

const signUp = async (_, args) => {
  const { openId, payload } = await retrieveUserInfo(args.token);
  if (payload.aud !== clientId) {
    throw new Error('Auth error!');
  }

  const userInput = {
    name: payload.name,
    openIds: [{ platform: 'GOOGLE', openId: openId }],
  };

  if (payload.email && payload.email_verified) {
    userInput.email = payload.email;
  }

  const user = await createUser(userInput);
  return {
    token: generateToken(user),
    user,
  };
};

const login = async (_, args, context) => {
  const userInfo = await retrieveUserInfo(args.token);
  const user = await findUser(userInfo.openId);
  return {
    token: generateToken(user),
    user,
  };
};

module.exports = { signUp, login };
