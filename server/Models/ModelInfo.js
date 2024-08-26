// models/Company.js
const mongoose = require('mongoose');

const modelInfo = new mongoose.Schema({
  model: { type: mongoose.Schema.Types.ObjectId, ref: 'Model' },
  requestPrice: { type: Number, required: true },
  requestDiscount: { type: Number, required: true },
  requestQuantity: { type: Number, required: true },
  reasons: [{type: String, required: true}],
  requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Request' },
  generatedBy : { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const ModelInfo = mongoose.model('ModelInfo', modelInfo);
module.exports = ModelInfo;