const { OAuth2Client } = require('google-auth-library');
const AuthInvalidError = require('../auth-invalid-error');

const clientId = process.env.GOOGLE_CLIENT_ID;

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
    throw new AuthInvalidError('Token has invalid aud');
  }
}

module.exports = { getValidUserInfo };
