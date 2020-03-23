const Ticket = require('./ticket');

class TicketRepository {
  getByEventId(eventId) {
    return Ticket.find({ eventId });
  }

  create(ticketInput) {
    return Ticket.create(ticketInput);
  }

  find(id) {
    return Ticket.findById(id);
  }

  findAndUpdate(id, data) {
    return Ticket.findByIdAndUpdate(id, data);
  }
}

module.exports = new TicketRepository();
