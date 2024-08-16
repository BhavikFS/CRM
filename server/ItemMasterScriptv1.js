// scripts/migrateSheet1.js
const mongoose = require("mongoose");
const XLSX = require("xlsx");
const path = require("path");
const cliProgress = require("cli-progress");
const Party = require("./Models/Party");
const Model = require("./Models/Modal"); // Make sure to use the correct path for your Model import

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://bhavikfs22:MUoCC3LotV4Z5zBz@cluster0.dbrjpil.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/CRM",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

// Function to process Excel sheets
const processSheet = (filePath) => {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(sheet);
};

// Process Sheet 1
const processSheet1 = () => {
  return processSheet(path.join(__dirname, "sheet1.xlsx"));
};

const migrateData = async () => {
  try {
    console.log("Migration process started.");

    // Load data from Sheet 1
    const partiesData = await processSheet1();
    console.log(`Sheet 1 Data Loaded: ${partiesData.length} rows`);

    // Initialize progress bar
    const progressBar = new cliProgress.SingleBar(
      {},
      cliProgress.Presets.shades_classic
    );
    progressBar.start(partiesData.length, 0);

    // Process each row in Sheet 1
    for (const [index, rowData] of partiesData.entries()) {
      // Create or find the Party
      let party = await Party.findOne({ partyCode: rowData["Party Code"] });

      if (!party) {
        party = new Party({
          name: rowData["Party Name"],
          partyCode: rowData["Party Code"],
          city: rowData["Station"] || null,
        });

        try {
          await party.save();
          console.log(`Created new Party: ${party.name}`);
        } catch (error) {
          console.error(`Error saving Party: ${error.message}`);
          continue; // Skip to the next iteration
        }
      }

      // Create or find the Model
      let model = await Model.findOne({ itemCode: rowData["Item Code"] });

      if (!model) {
        model = new Model({
          name: rowData["Modal Name"] || null,
          itemCode: rowData["Item Code"] || null,
          party: party._id,
          listPrice: rowData["List Price"] || null,
          discount: rowData["Disc (%)"] || null,
        });

        try {
          await model.save();
          console.log(
            `Created new Model: ${model.name} linked to Party: ${party.name}`
          );
        } catch (error) {
          console.error(`Error saving Model: ${error.message}`);
          continue; // Skip to the next iteration
        }
      }

      progressBar.update(index + 1);
    }

    progressBar.stop();
    console.log("Data migration from Sheet 1 completed.");
  } catch (error) {
    console.error("Error during migration:", error);
  } finally {
    mongoose.connection.close();
    console.log("MongoDB connection closed.");
  }
};

migrateData();
