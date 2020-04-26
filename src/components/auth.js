const PermissionError = require("./permission-error");

function checkAuth({ authError, user }) {
  if (authError) {
    throw authError;
  }
  if (!user) {
    throw new PermissionError('Need login');
  }
}

function needAuth(fn) {
  return (...args) => {
    checkAuth(args[2]);
    return fn(...args);
  };
}

module.exports = { needAuth };
