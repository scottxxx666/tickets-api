require('dotenv').config();
const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');
const initDB = require('./db');
const resolvers = require('./resolvers');
const { AuthenticationError } = require('apollo-server');
const DuplicateError = require('./components/user/error/duplicate-error');
const NotFoundError = require('./components/user/error/not-found-error');
const context = require('./context');

initDB();

const server = new ApolloServer({
  typeDefs, resolvers, context,
  formatError: (err) => {
    if (err.message.startsWith('Token ') || err.originalError instanceof DuplicateError || err.originalError instanceof NotFoundError) {
      return new AuthenticationError(err.message);
    }
    return err;
  },
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
