const TicketRepo = require('./ticket-repository');

const tickets = (parent, args, { dataSources }) => {
  return dataSources.ticketRepo.getByEventId(args.eventId);
};

const createTicket = (parent, args, { dataSources, user }) => {
  const input = args.input;
  return dataSources.ticketRepo.create({
    status: 'WAITING',
    area: input.area,
    seat: input.seat,
    number: input.number,
    price: input.price,
    payment: input.payment,
    note: input.note,
    contactInformation: input.contactInformation,
    postedBy: { id: user.id },
    eventId: input.event.id,
  });
};

function checkPermission(ticket, context) {
  if (ticket.postedBy.id.toString() !== context.user.id) {
    throw new Error('No permission');
  }
}

const updateTicket = async (parent, args, context) => {
  const input = args.input;
  const id = args.id;
  const ticket = await TicketRepo.find(id);
  checkPermission(ticket, context);
  return context.ticketRepo.findAndUpdate(id, {
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

module.exports = { tickets, createTicket, updateTicket };

