const { ApolloServer, gql } = require('apollo-server');
const mongoose = require('mongoose');

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  type Ticket {
    id: ID!
    artist: String!
    area: String!
    seat: String!
    number: Int!
    price: Int!
    payment: String!
    note: String
    contactWay: [ContactWay]
    createdAt: String!
    updatedAt: String!
  }

  type ContactWay {
    platform: String
    id: String
  }

  type Query {
    getTickets: [Ticket]
  }
  
  type Mutation {
    createTicket(artist: String!, area: String!): Ticket
    updateTicket(id: ID!, artist: String): Ticket 
  }
`;

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

const getTickets = () => {
  return Ticket.find();
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
      return Ticket.findByIdAndUpdate(args.id, {artist: args.artist, area: 'www'});
    },
  },
};

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_URL}/${process.env.DB_NAME}`, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  autoIndex: true,
});

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
