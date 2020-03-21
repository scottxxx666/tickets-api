const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const userSchema = new mongoose.Schema({
  email: String,
  name: String,
  openIds: [{ platform: String, openId: String }],
}, { timestamps: true });

userSchema.index({ "openIds.platform": 1, "openIds.openId": 1 }, { unique: true });

const User = mongoose.model('User', userSchema);

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
    console.log(payload);
    console.log(clientId);
    throw new Error('Auth error!');
  }

  const userInput = {
    name: payload.name,
    openIds: [{ platform: 'GOOGLE', openId: openId }],
  };

  if (payload.email && payload.email_verified) {
    userInput.email = payload.email;
  }

  const user = await User.create(userInput);
  return {
    token: generateToken(user),
    user,
  };
};

const login = async (_, args, context) => {
  const userInfo = await retrieveUserInfo(args.token);
  const user = await User.findOne({ 'openIds.platform': 'GOOGLE', 'openIds.openId': userInfo.openId });
  return {
    token: generateToken(user),
    user,
  };
};

module.exports = { signUp, login };
