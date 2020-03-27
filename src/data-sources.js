const userRepo = require('./components/user/user-repository');
const ticketRepo = require('./components/ticket/ticket-repository');

const dataSources = () => {
  return {
    userRepo, ticketRepo,
  };
};

module.exports = dataSources;
