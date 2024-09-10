const mongoose = require("mongoose");

const approvalSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "ReviewRequired", "ReviewBack"],
      required: true,
    },
    reasons: [{type: String, required: true}],
    comments: { type: String },
  },
  { timestamps: true }
);

const managerSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      required: true,
    },
    comments: { type: String },
  },
  { timestamps: true }
);

const requestSchema = new mongoose.Schema(
  {
    party: { type: mongoose.Schema.Types.ObjectId, ref: "Party" },
    subParty: { type: mongoose.Schema.Types.ObjectId, ref: "SubParty" },
    modelInfo: { type: mongoose.Schema.Types.ObjectId, ref: "ModelInfo" },
    pricingUsers: approvalSchema, // Array to manage multiple pricing users
    financeUsers: approvalSchema, // Array to manage multiple finance users
    status: { type: String, required: true },
    generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    manager: managerSchema,
    requestID: { type: String, required: true },
    managerStatusCO: { type: String, enum: ["approved", "rejected"] },
    managerStatusPC: { type: String, enum: ["approved", "rejected"] },
    freightCharge: { type: Number },
    materialInsuranceRate: { type:Number },
    emailUserList: [ {type: mongoose.Schema.Types.ObjectId, ref: "User"} ]
  },
  { timestamps: true }
);

const Request = mongoose.model("Request", requestSchema);
module.exports = Request;
