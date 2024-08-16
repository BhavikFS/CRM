// scripts/migrateSheet1.js
const mongoose = require('mongoose');
const XLSX = require('xlsx');
const path = require('path');
const cliProgress = require('cli-progress');
const Party = require('./Models/Party');
const Model = require('./Models/Model'); // Make sure to use the correct path for your Model import

// Connect to MongoDB
mongoose.connect('mongodb+srv://bhavikfs22:MUoCC3LotV4Z5zBz@cluster0.dbrjpil.mongodb.net/yourDatabaseName?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Function to process Excel sheets
const processSheet = (filePath) => {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(sheet, { defval: null }); // Use defval to handle missing fields
};

// Process Sheet 1
const processSheet1 = () => {
  return processSheet(path.join(__dirname, 'sheet1.xlsx'));
};

const migrateData = async () => {
  try {
    console.log('Migration process started.');

    // Load data from Sheet 1
    const partiesData = await processSheet1();
    console.log(`Sheet 1 Data Loaded: ${partiesData.length} rows`);

    // Initialize progress bar
    const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    progressBar.start(partiesData.length, 0);

    // Arrays to hold batch inserts
    const partyInserts = [];
    const modelInserts = [];

    // Process each row in Sheet 1
    for (let index = 0; index < partiesData.length; index++) {
      const rowData = partiesData[index];
      const lineNumber = index + 2; // Excel rows start at 1 and 1st row is header

      try {
        // Find or create the Party
        let party = await Party.findOne({ partyCode: rowData['Party Code'] }).exec();

        if (!party) {
          party = new Party({
            name: rowData['Party Name'],
            partyCode: rowData['Party Code'],
            city: rowData['Station'],
          });
          await party.save();
          console.log(`Created new Party: ${party.name}`);
        }

        // Ensure that party is defined before creating the model
        if (!party) {
          throw new Error(`Party not found or created for line ${lineNumber}`);
        }

        // Find or create the Model
        let model = await Model.findOne({ itemCode: rowData['Item Code'] }).exec();

        if (!model) {
          model = new Model({
            name: rowData['Modal Name'],
            itemCode: rowData['Item Code'],
            party: party._id,
            listPrice: rowData['List Price'],
            discount: rowData['Disc (%)'],
          });
          modelInserts.push(model);
        }
      } catch (error) {
        console.error(`Error processing line ${lineNumber}: ${error.message}`);
      }

      progressBar.update(index + 1);
    }

    // Perform batch insert operations
    if (partyInserts.length > 0) {
      try {
        await Party.insertMany(partyInserts, { ordered: false });
        console.log(`Inserted ${partyInserts.length} new parties.`);
      } catch (error) {
        console.error(`Error inserting parties: ${error.message}`);
      }
    }

    if (modelInserts.length > 0) {
      try {
        await Model.insertMany(modelInserts, { ordered: false });
        console.log(`Inserted ${modelInserts.length} new models.`);
      } catch (error) {
        console.error(`Error inserting models: ${error.message}`);
      }
    }

    progressBar.stop();
    console.log('Data migration from Sheet 1 completed.');
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
};

migrateData();
