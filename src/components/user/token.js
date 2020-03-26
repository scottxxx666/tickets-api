const jwt = require('jsonwebtoken');

function generate(user) {
  return jwt.sign({
    user: { id: user.id },
  }, process.env.SECRET_KEY, { expiresIn: process.env.expiredTime });
}

function decode(token) {
  return jwt.verify(token, process.env.SECRET_KEY);
}

const Token = { generate, decode };
module.exports = Token;
