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

module.exports = Ticket;
