const mongoose = require("mongoose");
const fs = require("fs");
const csv = require("csv-parser");
const Party = require("./Models/Party");
const Model = require("./Models/Modal");

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://bhaviklotia22:CRM22@cluster0.4etpf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/test",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

const partyIdMap = new Map();
let partyArray = [];
let modelArray = [];

// Function to process the CSV file
fs.createReadStream('./p1.csv')
  .pipe(csv())
  .on('data', (row) => {
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
  .on('end', async () => {
    console.log('CSV file read completed. Processing bulk insert...');

    try {
      // Bulk insert Parties
      if (partyArray.length > 0) {
        const insertedParties = await Party.insertMany(partyArray, { ordered: false });
        insertedParties.forEach(party => {
          partyIdMap.set(party.partyCode, party._id); // Update Map with new Party IDs
        });
      }

      // Replace partyCode in modelArray with actual party ID
      modelArray = modelArray.map(modelData => ({
        ...modelData,
        party: partyIdMap.get(modelData.partyCode),
        partyCode: undefined // Remove partyCode field
      }));

      // Bulk insert Models
      if (modelArray.length > 0) {
        await Model.insertMany(modelArray, { ordered: false });
      }

      console.log("Data migration from CSV completed.");
    } catch (error) {
      console.error("Error during bulk insertion:", error);
    } finally {
        console.error("Finally insertion:");

    }
  })
  .on('error', (error) => {
    console.error('Error reading the CSV file:', error);
  });
