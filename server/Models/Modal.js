const mongoose = require('mongoose');

const modelSchema = new mongoose.Schema({
  name: { type: String, required: true},
  itemCode: { type: String, required: true },
  party: { type: mongoose.Schema.Types.ObjectId, ref: 'Party', required: true },
  subParty: { type: mongoose.Schema.Types.ObjectId, ref: 'SubParty' },
  listPrice: {type: Number},
  discount: {type: Number},
  stockDate: {type: Date},
  quantity: {type: Number},
  itemRate: {type: Number}
});

const Model = mongoose.model('Model', modelSchema);

module.exports = Model;
