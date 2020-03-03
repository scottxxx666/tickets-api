const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
const typeDefs = require('./schema');

require('dotenv').config();

const Ticket = mongoose.model('Tickets', new mongoose.Schema({
  artist: { type: String, index: true },
  area: String,
  seat: String,
  number: Number,
  price: Number,
  payment: String,
  note: String,
  contactWay: [{ platform: String, id: String }],
  createdAt: Date,
  updatedAt: Date,
}));

const getTickets = (parent, args) => {
  return Ticket.find({ artist: args.artist });
};

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
