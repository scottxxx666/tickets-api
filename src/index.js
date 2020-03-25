require('dotenv').config();
const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');
const { decodeToken } = require('./components/user');
const initDB = require('./db');
const resolvers = require('./resolvers');
const { AuthenticationError } = require('apollo-server');
const DuplicateError = require('./components/user/error/duplicate-error');

initDB();

const server = new ApolloServer({
  typeDefs, resolvers, context: ({ req }) => {
    const auth = req.get('Authorization');
    if (auth) {
      const token = auth.replace('Bearer ', '');
      const { user } = decodeToken(token);
      return {
        user,
      };
    }
  },
  formatError: (err) => {
    if (err.message.startsWith('Token ') || err.originalError instanceof DuplicateError) {
      return new AuthenticationError(err.message);
    }
    return err;
  },
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
