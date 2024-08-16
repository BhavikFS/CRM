// scripts/migrate.js
const mongoose = require('mongoose');
const XLSX = require('xlsx');
const path = require('path');
const cliProgress = require('cli-progress');
const Party = require('./Models/Party');
const SubParty = require('./Models/SubParty');

// Connect to MongoDB
mongoose.connect('mongodb+srv://bhavikfs22:MUoCC3LotV4Z5zBz@cluster0.dbrjpil.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/CRM', { useNewUrlParser: true, useUnifiedTopology: true });

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
    const subCompaniesData = await processSheet2();
    console.log(`Sheet 2 Data Loaded: ${subCompaniesData.length} rows`);

    // Initialize progress bar
    const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    progressBar.start(subCompaniesData.length, 0);

    // Process each row in Sheet 2
    for (const [index, subCompany] of subCompaniesData.entries()) {
      let party = await Party.findOne({ partyCode: subCompany['Party Code'] });

      if (!party) {
        // Create a new Party if it doesn't exist
        party = new Party({
          name: subCompany['Party Name'],
          partyCode: subCompany['Party Code'],
          city: subCompany['Station']
        });
        await party.save();
        console.log(`Created new Party: ${party.name}`);
      }

      const newSubParty = new SubParty({
        name: subCompany['RefSubParty'] || null,
        city: subCompany['Station'] || null,
        party: party._id
      });
      await newSubParty.save();
      console.log(`Created new SubParty: ${newSubParty.name} linked to Party: ${party.name}`);
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
