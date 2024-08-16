// scripts/migrateSheet2.js
const mongoose = require('mongoose');
const XLSX = require('xlsx');
const path = require('path');
const cliProgress = require('cli-progress');
const Party = require('./Models/Party');
const SubParty = require('./Models/SubParty');
const Model = require('./Models/Modal');

// Connect to MongoDB
mongoose.connect('mongodb+srv://bhavikfs22:MUoCC3LotV4Z5zBz@cluster0.dbrjpil.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/CRM', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Function to process Excel sheets
const processSheet = (filePath) => {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(sheet);
};

// Process Sheet 2
const processSheet2 = () => {
  return processSheet(path.join(__dirname, 'sheet2.xlsx'));
};

const migrateData = async () => {
  try {
    console.log('Migration process started.');

    // Load data from Sheet 2
    const data = await processSheet2();
    console.log(`Sheet 2 Data Loaded: ${data.length} rows`);

    // Initialize progress bar
    const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    progressBar.start(data.length, 0);

    // Process each row in Sheet 2
    for (const [index, rowData] of data.entries()) {
      // Create or find the Party
      let party = await Party.findOne({ partyCode: rowData['Party Code'] });

      if (!party) {
        party = new Party({
          name: rowData['Party Name'],
          partyCode: rowData['Party Code'],
          city: rowData['Station'] || null
        });
        await party.save();
        console.log(`Created new Party: ${party.name}`);
      }

      // Create or find the SubParty
      let subParty = null;
      if (rowData['RefSubParty']) {
        subParty = await SubParty.findOne({
          name: rowData['RefSubParty'],
          party: party._id,
        });

        if (!subParty) {
          // Create a new SubParty if not exists
          subParty = new SubParty({
            name: rowData['RefSubParty'],
            city: rowData['Station'] || null,
            party: party._id
          });
          await subParty.save();
          console.log(`Created new SubParty: ${subParty.name} linked to Party: ${party.name}`);
        } else {
          console.log(`SubParty already exists: ${subParty.name} linked to Party: ${party.name}`);
        }
      }

      // Create or find the Model
      let model = await Model.findOne({ itemCode: rowData['Item Code'] });

      if (!model) {
        model = new Model({
          name: rowData['Modal Name'],
          itemCode: rowData['Item Code'],
          party: party._id,
          subParty: subParty ? subParty._id : null,
          listPrice: rowData['List Price'] || null,
          discount: rowData['Disc (%)'] || null
        });
        await model.save();
        console.log(`Created new Model: ${model.name} linked to SubParty: ${subParty.name}`);
      }

      progressBar.update(index + 1);
    }

    progressBar.stop();
    console.log('Data migration from Sheet 2 completed.');
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
};

migrateData();
