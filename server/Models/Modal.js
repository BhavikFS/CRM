const mongoose = require('mongoose');

const salesSchema = new mongoose.Schema({
  itemCode: { type: String, required: true, unique: true },
  subParty: { type: mongoose.Schema.Types.ObjectId, ref: 'SubParty' },
  listPrice: {type: Number},
  discount: {type: Number},
  stockDate: {type: Date},
  quantity: {type: Number},
  itemRate: {type: Number}
});

const Sales = mongoose.model('Sales', salesSchema);

module.exports = Sales;
