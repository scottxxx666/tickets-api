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
  createdAt: Date,
  updatedAt: Date,
}));

const getTickets = (parent, args) => {
  return Ticket.find({ artist: args.artist });
};

module.exports = { getTickets };

