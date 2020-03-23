require('dotenv').config();
const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
const typeDefs = require('./schema');
const { tickets, createTicket, updateTicket } = require('./components/ticket');
const { signUp, login, decodeToken } = require('./components/user');

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

mongoose.set('useFindAndModify', false);
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_URL}/${process.env.DB_NAME}`, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  autoIndex: true,
});

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
