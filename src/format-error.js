const { AuthenticationError } = require('apollo-server');
const DuplicateError = require('./components/user/error/duplicate-error');
const NotFoundError = require('./components/user/error/not-found-error');

function isAuthError(err) {
  return err.message.startsWith('Token ') ||
    err.originalError instanceof DuplicateError ||
    err.originalError instanceof NotFoundError ||
    err.message.startsWith('Context');
}

const formatError = (err) => {
  if (isAuthError(err)) {
    return new AuthenticationError(err.message);
  }
  return err;
};

module.exports = formatError;
