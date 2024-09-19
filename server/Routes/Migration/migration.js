

const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const fs = require("fs");
const csv = require("csv-parser");
const Party = require("../../Models/Party");
const Model = require("../../Models/Modal");
const router = express.Router();

// Configure multer for file upload (in-memory)
const upload = multer({ dest: "uploads/" });

// In-memory map and arrays
let partyIdMap = new Map();
let partyArray = [];
let modelArray = [];

// Combined Upload and Migration API
router.post("/uploadAndMigrate", upload.single("csvFile"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const filePath = req.file.path;
  partyIdMap = new Map(); // Reset map
  partyArray = [];
  modelArray = [];

  // Process the CSV file and start migration
  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      try {
        // Process each row and collect data for bulk insert
        if (!partyIdMap.has(row["Party Code"])) {
          partyArray.push({
            name: row["Party Name"],
            partyCode: row["Party Code"],
            city: row["Station"],
          });
          partyIdMap.set(row["Party Code"], null); // Mark partyCode as pending
        }

        // Prepare the model data
        modelArray.push({
          partyCode: row["Party Code"], // Store partyCode for future reference
          name: row["Description"],
          itemCode: row["Item Code"],
          listPrice: row["List Price"],
          discount: row["Disc (%)"],
        });
      } catch (error) {
        console.error(`Error processing row: ${row}, error: ${error}`);
      }
    })
    .on("end", async () => {
      console.log("CSV file read completed. Processing bulk insert...");

      try {
        // Bulk insert Parties
        if (partyArray.length > 0) {
          const insertedParties = await Party.insertMany(partyArray, { ordered: false });
          insertedParties.forEach((party) => {
            partyIdMap.set(party.partyCode, party._id); // Update Map with new Party IDs
          });
        }

        // Replace partyCode in modelArray with actual party ID
        modelArray = modelArray.map((modelData) => ({
          ...modelData,
          party: partyIdMap.get(modelData.partyCode),
          partyCode: undefined, // Remove partyCode field
        }));

        // Bulk insert Models
        if (modelArray.length > 0) {
          await Model.insertMany(modelArray, { ordered: false });
        }

        console.log("Data migration from CSV completed.");
        res.status(200).json({ message: "Data migration completed successfully" });
      } catch (error) {
        console.error("Error during bulk insertion:", error);
        res.status(500).json({ error: "Error during bulk insertion" });
      } finally {
        // Clean up the file
        fs.unlink(filePath, (err) => {
          if (err) console.error("Error deleting file:", err);
        });
      }
    })
    .on("error", (error) => {
      console.error("Error reading the CSV file:", error);
      res.status(500).json({ error: "Error reading the CSV file" });
    });
});


module.exports = router;
