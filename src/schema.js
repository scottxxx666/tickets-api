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
        contactInformation: [ContactInformation]
        createdAt: String!
        updatedAt: String!
        postedBy: User!
        event: Event!
    }

    input TicketInput {
        artist: String!
        area: String!
        seat: String!
        number: Int!
        price: Int!
        payment: String!
        note: String
        contactInformation: [ContactInformationInput]
        event: EventInput!
    }

    input ContactInformationInput {
        platform: String!
        platformId: String!
    }

    input EventInput {
        id: ID!
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

    type ContactInformation {
        platform: String!
        platformId: String!
    }

    type Query {
        tickets(artist: String!): [Ticket]
    }

    type Mutation {
        signUp(platform: String!, openId: String!): AuthPayload
        login(platform: String!, openId: String!): AuthPayload
        createTicket(input: TicketInput!): Ticket
        updateTicket(id: ID!, input: TicketInput): Ticket
    }
`;
