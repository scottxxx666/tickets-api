const { ApolloServer, gql } = require('apollo-server');

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  type Ticket {
    id: ID!
    area: String!
    seat: String!
    number: Int!
    price: Int!
    payment: String!
    note: String
    contactWay: [ContactWay]
  }

  type ContactWay {
    platform: String
    id: String
  }

  type Query {
    getTickets: [Ticket]
  }
`;

const books = [
  {
    id: 'AJDJDOIDJW',
    title: 'Harry Potter and the Chamber of Secrets',
    author: 'J.K. Rowling',
  },
  {
    id: 'asdqwqf',
    title: 'Jurassic Park',
    author: 'Michael Crichton',
  },
];

const resolvers = {
  Query: {
    getTickets: () => books,
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
