// models/Company.js
const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  party: { type: mongoose.Schema.Types.ObjectId, ref: 'Party' },
  subParty: { type: mongoose.Schema.Types.ObjectId, ref: 'Sub Party' },
  modelInfo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ModelInfo' }],
  pricingUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  financeUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: {type: String, required: true}
});

const Request = mongoose.model('Request', requestSchema);
module.exports = Request;