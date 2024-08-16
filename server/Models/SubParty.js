const mongoose = require('mongoose');

const subPartySchema = new mongoose.Schema({
  name: { type: String},
  city: { type: String },
  party: { type: mongoose.Schema.Types.ObjectId, ref: 'Party' }
});

const SubParty = mongoose.model('SubParty', subPartySchema);

module.exports = SubParty;
