const { tickets, createTicket, updateTicket } = require('./components/ticket');
const { signUp, login } = require('./components/user');

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

module.exports = resolvers;
