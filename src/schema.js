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
        postedBy: User!
        event: Event!
    }

    type User {
        id: ID!
        email: String
    }

    type Event {
        id: ID!
        artist: String!
    }

    type AuthPayload {
        token: String!
        user: User
    }

    type ContactWay {
        platform: String
        id: String
    }

    type Query {
        tickets(artist: String!): [Ticket]
    }

    type Mutation {
        signUp(platform: String!, openId: String!): AuthPayload
        login(platform: String!, openId: String!): AuthPayload
        createTicket(artist: String!, area: String!): Ticket
        updateTicket(id: ID!, artist: String): Ticket
    }
`;
