const DataLoader = require('dataloader');
const ticketRepo = require('./ticket-repository');

const createTicketLoader = () => {
  return new DataLoader(async (ids) => {
    return ids.map(id => ticketRepo.find(id));
  });
};

const createEventTicketLoader = () => {
  return new DataLoader(async (eventIds) => {
    return eventIds.map(eventId => ticketRepo.getByEventId(eventId));
  });
};

module.exports = {
  createTicketLoader,
  createEventTicketLoader,
};
