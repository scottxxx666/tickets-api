require('dotenv').config();
const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');
const { decodeToken } = require('./components/user');
const initDB = require('./db');
const resolvers = require('./resolvers');
const { AuthenticationError } = require('apollo-server');

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
    // let client know token error
    if (err.message.startsWith('Token ')) {
      return new AuthenticationError(err.message);
    }

    return err;
  },
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
