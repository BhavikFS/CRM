const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
  model: { type: mongoose.Schema.Types.ObjectId, ref: "Model" },
  itemCode: { type: Number },
  purchaseData: [
    {
      purchaseDate: { type: Date },
      purchaseQty: { type: Number },
      itemRate: { type: Number },
      totalAmount: { type: Number },
    },
  ],
});

const Purchase = mongoose.model("Purchase", purchaseSchema);

module.exports = Purchase;
