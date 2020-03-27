require('dotenv').config();
const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');
const initDB = require('./db');
const resolvers = require('./resolvers');
const context = require('./context');
const formatError = require('./format-error');
const userRepo = require('./components/user/user-repository');

initDB();

const server = new ApolloServer({
  typeDefs, resolvers, context, formatError, dataSources: () => ({
    userRepo: userRepo,
  }),
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
