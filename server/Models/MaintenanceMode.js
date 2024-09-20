const mongoose = require('mongoose');

const maintenanceModeSchema = new mongoose.Schema({
  isMaintenanceMode: {
    type: Boolean,
    default: false,  // Default value set to false
    required: true
  },
  message: {
    type: String,  // Optional field for custom maintenance message
    default: 'The system is under maintenance.'
  },
}, {
  timestamps: true  // This adds 'createdAt' and 'updatedAt' automatically
});

const MaintenanceMode = mongoose.model('MaintenanceMode', maintenanceModeSchema);

module.exports = MaintenanceMode;
