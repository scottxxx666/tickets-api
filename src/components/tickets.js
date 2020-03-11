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
  userId: mongoose.ObjectId,
}, { timestamps: true }));

const getTickets = (parent, args) => {
  return Ticket.find({ artist: args.artist });
};

const createTicket = (parent, args, context, info) => {
  return Ticket.create({
    artist: args.artist,
    area: args.area,
    seat: args.seat,
    number: args.number,
    price: args.price,
    payment: args.payment,
    note: args.note,
    contactWay: args.contactWay,
    userId: context.user.id,
  });
};

const updateTicket = async (parent, args, context) => {
  const ticket = await Ticket.findById(args.id);
  if (ticket.userId.toString() !== context.user.id) {
    throw new Error('No permission');
  }
  return Ticket.findByIdAndUpdate(args.id, { artist: args.artist, area: 'www2' });
};

module.exports = { getTickets, createTicket, updateTicket };

