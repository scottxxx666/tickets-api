const { AuthenticationError } = require('apollo-server');
const DuplicateError = require('./components/user/error/duplicate-error');
const NotFoundError = require('./components/user/error/not-found-error');

const formatError = (err) => {
  if (err.message.startsWith('Token ') || err.originalError instanceof DuplicateError || err.originalError instanceof NotFoundError) {
    return new AuthenticationError(err.message);
  }
  return err;
};

module.exports = formatError;
