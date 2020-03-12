const mongoose = require('mongoose');

const Ticket = mongoose.model('Tickets', new mongoose.Schema({
  artist: { type: String, index: true },
  area: String,
  seat: String,
  number: Number,
  price: Number,
  payment: String,
  note: String,
  contactWay: [{ platform: String, id: String }],
  postedBy: mongoose.ObjectId,
}, { timestamps: true }));

const tickets = (parent, args) => {
  return Ticket.find({ artist: args.artist });
};

const createTicket = (parent, args, context, info) => {
  const input = args.input;
  return Ticket.create({
    artist: input.artist,
    area: input.area,
    seat: input.seat,
    number: input.number,
    price: input.price,
    payment: input.payment,
    note: input.note,
    contactWay: input.contactWay,
    postedBy: context.user.id,
    event: input.event.id,
  });
};

const updateTicket = async (parent, args, context) => {
  const input = args.input;
  const id = args.id;
  const ticket = await Ticket.findById(id);
  if (ticket.postedBy.toString() !== context.user.id) {
    throw new Error('No permission');
  }
  return Ticket.findByIdAndUpdate(id, {
    artist: input.artist,
    area: input.area,
    seat: input.seat,
    number: input.number,
    price: input.price,
    payment: input.payment,
    note: input.note,
    contactWay: input.contactWay,
    postedBy: context.user.id,
    event: input.event.id,
  });
};

module.exports = { tickets, createTicket, updateTicket };

