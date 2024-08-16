// models/Company.js
const mongoose = require('mongoose');

const partySchema = new mongoose.Schema({
  name: { type: String, required: true },
  partyCode: { type: String, required: true, unique: true }, // Add partyCode
  city: { type: String },
  creditDays: { type: Number },
  creditLimit: { type: Number },
  totalOverdue: { type: Number },
});

const Party = mongoose.model('Party', partySchema);
module.exports = Party;