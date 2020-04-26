const TicketRepo = require('./ticket-repository');
const ResourceNotFound = require('./errors/resource-not-found-error');
const PermissionError = require('../permission-error');
const { checkAuth } = require('../auth');

const tickets = (parent, args, { dataSources }) => {
  return dataSources.eventTicketLoader.load(args.eventId);
};

const ticket = (parent, args, { dataSources }) => {
  return dataSources.ticketLoader.load(args.id);
};

const createTicket = (parent, args, context) => {
  checkAuth(context);
  const input = args.input;
  return context.dataSources.ticketRepo.create({
    status: 'WAITING',
    area: input.area,
    seat: input.seat,
    number: input.number,
    price: input.price,
    payment: input.payment,
    note: input.note,
    contactInformation: input.contactInformation,
    postedBy: { id: context.user.id },
    eventId: input.event.id,
  });
};

function checkPermission(ticket, context) {
  checkAuth(context);

  if (ticket.postedBy.id.toString() !== context.user.id) {
    throw new PermissionError('No permission');
  }
}

const updateTicket = async (parent, args, context) => {
  const input = args.input;
  const id = args.id;
  const ticket = await TicketRepo.find(id);
  checkExists(ticket);
  checkPermission(ticket, context);
  return context.dataSources.ticketRepo.findAndUpdate(id, {
    status: input.status,
    area: input.area,
    seat: input.seat,
    number: input.number,
    price: input.price,
    payment: input.payment,
    note: input.note,
    contactInformation: input.contactInformation,
    postedBy: { id: context.user.id },
    eventId: input.event.id,
  });
};

function checkExists(ticket) {
  if (!ticket) {
    throw new ResourceNotFound('Ticket not found');
  }
}

module.exports = { ticket, tickets, createTicket, updateTicket };

