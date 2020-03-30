const { AuthenticationError, ForbiddenError, UserInputError } = require('apollo-server');
const DuplicateError = require('./components/user/error/duplicate-error');
const NotFoundError = require('./components/user/error/not-found-error');
const PermissionError = require('./components/ticket/errors/permission-error');
const ResouceNotFoundError = require('./components/ticket/errors/resource-not-found-error');

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
  if (err.originalError instanceof PermissionError) {
    return new ForbiddenError(err.message);
  }
  if (err.originalError instanceof ResouceNotFoundError) {
    return new UserInputError(err.message);
  }
};

module.exports = formatError;
