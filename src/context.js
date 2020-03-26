const { decodeToken } = require('./components/user');

const context = ({ req }) => {
  const auth = req.get('Authorization');
  if (auth) {
    const token = auth.replace('Bearer ', '');
    const { user } = decodeToken(token);
    return {
      user,
    };
  }
};

module.exports = context;
