const PermissionError = require("./permission-error");

function checkAuth({ authError, user }) {
  if (authError) {
    throw authError;
  }
  if (!user) {
    throw new PermissionError('Need login');
  }
}

module.exports = { checkAuth };
