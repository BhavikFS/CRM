const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const MaintenanceMode = require("../../Models/MaintenanceMode");
const AdminVerify = require("../../Middleware/AdminVerify");

// GET API to retrieve the maintenance mode status
router.get('/maintenance-mode',AdminVerify ,async (req, res) => {
    try {
        const maintenanceData = await MaintenanceMode.findOne(); // Assuming you have one document for maintenance mode

        if (!maintenanceData) {
            return res.status(404).json({ message: 'Maintenance mode not configured yet.' });
        }

        res.json({
            isMaintenanceMode: maintenanceData.isMaintenanceMode,
            message: maintenanceData.message
        });
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while fetching maintenance mode status' });
    }
});

// POST API to update the maintenance mode status
router.post('/maintenance-mode',AdminVerify, async (req, res) => {
    const { isMaintenanceMode, message } = req.body;

    try {
        // Update or create maintenance mode document
        let maintenanceData = await MaintenanceMode.findOne();

        if (!maintenanceData) {
            // If no document exists, create one
            maintenanceData = new MaintenanceMode({ isMaintenanceMode, message });
        } else {
            // If a document exists, update its fields
            maintenanceData.isMaintenanceMode = isMaintenanceMode;
            maintenanceData.message = message || maintenanceData.message;
        }

        // Save the updated or new document
        await maintenanceData.save();

        res.json({
            message: 'Maintenance mode updated successfully',
            maintenanceData
        });
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while updating maintenance mode' });
    }
});
module.exports = router;
