// scripts/migrateSheet4.js
const mongoose = require('mongoose');
const XLSX = require('xlsx');
const path = require('path');
const cliProgress = require('cli-progress');
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

// Process Sheet 4
const processSheet4 = () => {
  return processSheet(path.join(__dirname, 'Stock.xlsx'));
};

const migrateData = async () => {
  try {
    console.log('Migration process started.');

    // Load data from Sheet 4
    const data = await processSheet4();
    console.log(`Sheet 4 Data Loaded: ${data.length} rows`);

    // Initialize progress bar
    const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    progressBar.start(data.length, 0);

    // Process each row in Sheet 4
    for (const [index, rowData] of data.entries()) {
      // Find the Model by Item Code
      let model = await Model.findOne({ itemCode: rowData['Item Code'] });

      if (model) {
        // Update the Model with Stock Date, Quantity, and Item Rate if available
        model.stockDate = rowData['Stock Date'] ? new Date(rowData['Stock Date']) : model.stockDate;
        model.quantity = rowData['Qty'] ?? null;
        model.itemRate = rowData['Item Rate'] ?? null;
        
        await model.save();
        console.log(`Updated Model: ${model.name} with Item Code: ${model.itemCode}`);
      } else {
        console.log(`Model not found for Item Code: ${rowData['Item Code']}`);
      }

      progressBar.update(index + 1);
    }

    progressBar.stop();
    console.log('Data migration from Sheet 4 completed.');
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
};

migrateData();
