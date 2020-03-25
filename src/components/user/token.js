function generate(user) {
  return jwt.sign({
    user: { id: user.id },
  }, process.env.SECRET_KEY, { expiresIn: '3d' });
}

function decode(token) {
  return jwt.verify(token, process.env.SECRET_KEY);
}

const Token = { generate, decode };
module.exports = Token;
