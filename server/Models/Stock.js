const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
  model: { type: mongoose.Schema.Types.ObjectId, ref: "Model" },
  itemCode: { type: Number },
  stockData: [
    {
      stockDate: { type: Date },
      stockQuantity: { type: Number },
      itemRate: { type: Number },
      itemValue: { type: Number },
    },
  ]
});

const Stock = mongoose.model("Stock", stockSchema);

module.exports = Stock;
