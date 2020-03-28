const userRepo = require('./components/user/user-repository');
const ticketRepo = require('./components/ticket/ticket-repository');
const createTicketLoader = require('./components/ticket/ticket-loader');
const createUserOpenIdLoader = require('./components/user/user-open-id-loader');

const dataSources = () => {
  return {
    userRepo, ticketRepo,
    ticketLoader: createTicketLoader(),
    userOpenIdLoader: createUserOpenIdLoader(),
  };
};

module.exports = dataSources;
