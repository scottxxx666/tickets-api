const userRepo = require('./components/user/user-repository');
const ticketRepo = require('./components/ticket/ticket-repository');
const createEventTicketLoader = require('./components/ticket/ticket-loader');
const createUserOpenIdLoader = require('./components/user/user-open-id-loader');

const dataSources = () => {
  return {
    userRepo, ticketRepo,
    eventTicketLoader: createEventTicketLoader(),
    userOpenIdLoader: createUserOpenIdLoader(),
  };
};

module.exports = dataSources;
