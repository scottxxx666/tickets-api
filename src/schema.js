const { gql } = require('apollo-server');

module.exports = gql`
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
        getTickets(artist: String!): [Ticket]
    }

    type Mutation {
        createTicket(artist: String!, area: String!): Ticket
        updateTicket(id: ID!, artist: String): Ticket
    }
`;
