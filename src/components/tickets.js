const mongoose = require('mongoose');

const Ticket = mongoose.model('Tickets', new mongoose.Schema({
  status: String,
  area: String,
  seat: String,
  number: Number,
  price: Number,
  payment: String,
  note: String,
  contactInformation: [{ platform: String, platformId: String }],
  postedBy: { id: mongoose.ObjectId },
  eventId: { type: mongoose.ObjectId, index: true },
}, { timestamps: true }));

const tickets = (parent, args) => {
  return Ticket.find({ eventId: args.eventId });
};

const createTicket = (parent, args, context, info) => {
  const input = args.input;
  return Ticket.create({
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

const updateTicket = async (parent, args, context) => {
  const input = args.input;
  const id = args.id;
  const ticket = await Ticket.findById(id);
  if (ticket.postedBy.id.toString() !== context.user.id) {
    throw new Error('No permission');
  }
  return Ticket.findByIdAndUpdate(id, {
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

