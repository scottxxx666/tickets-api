const { decodeToken } = require('./components/user');

const context = ({ req }) => {
  return {
    user: authUser(req),
  };
};

const authUser = (req) => {
  const auth = req.get('Authorization');
  if (!auth) {
    return null;
  }
  const token = auth.replace('Bearer ', '');
  const { user } = decodeToken(token);
  return user;
};

module.exports = context;
