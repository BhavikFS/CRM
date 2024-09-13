// models/Company.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  partyName: { type: String },
  partyCode: { type: String }, // Add partyCode
  creditDays: { type: Number },
  creditLimit: { type: Number },
  overDue: { type: Number },
  diffDays: { type: Number },
  belowDue: { type: Number },
  totalDue: { type: Number },
});

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;