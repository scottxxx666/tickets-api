const { decodeToken } = require('./components/user');

const context = ({ req }) => {
  return {
    ...authUser(req),
  };
};

const authUser = (req) => {
  const auth = req.get('Authorization');
  if (!auth) {
    return { user: null, authError: null };
  }
  const token = auth.replace('Bearer ', '');
  try {
    const { user } = decodeToken(token);
    return { user, authError: null };
  } catch (e) {
    return { user: null, authError: e };
  }
};

module.exports = context;
