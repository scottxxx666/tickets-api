const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
const typeDefs = require('./schema');
const { getTickets } = require('./components/tickets');

require('dotenv').config();

const resolvers = {
  Query: {
    getTickets: getTickets,
  },
  Mutation: {
    createTicket: (parent, args, context, info) => {
      return Ticket.create({
        artist: args.artist,
        area: args.area,
        seat: args.seat,
        number: args.number,
        price: args.price,
        payment: args.payment,
        note: args.note,
        contactWay: args.contactWay,
      });
    },
    updateTicket: (parent, args) => {
      return Ticket.findByIdAndUpdate(args.id, { artist: args.artist, area: 'www' });
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

const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
