const mongoose = require('mongoose');

const salesSchema = new mongoose.Schema({
  model: { type: mongoose.Schema.Types.ObjectId, ref: 'Model' },
  salesDate: { type: String, required: true},
  totalAmount: {type: Number},
  salesQuantity: {type: Number},
  itemRate: {type: Number},
  itemCode: {type: Number},
  invoiceNumber: {type: String},
});

const Sales = mongoose.model('Sales', salesSchema);

module.exports = Sales;
