require('dotenv').config();
const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');
const { tickets, createTicket, updateTicket } = require('./components/ticket');
const { signUp, login, decodeToken } = require('./components/user');
const initDB = require('./db');

const resolvers = {
  Query: {
    tickets,
  },
  Mutation: {
    signUp,
    login,
    createTicket,
    updateTicket,
  },
  Ticket: {
    event: (parent) => {
      return { id: parent.eventId };
    },
  },
};

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
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
