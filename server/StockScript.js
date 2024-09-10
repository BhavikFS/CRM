const mongoose = require('mongoose');
const XLSX = require('xlsx');
const path = require('path');
const cliProgress = require('cli-progress');
const Stock = require('./Models/Stock'); // Updated to use Stock schema
const Model = require('./Models/Modal'); // Assuming Model is the referenced model in Stock

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
      const itemCode = rowData['Item Code']
      let model = await Model.findOne({ itemCode });

      if (model) {
        // Create a stock entry based on the current row
        const stockEntry = {
          stockDate: rowData['Stock Date'] ? new Date(rowData['Stock Date']) : null,
          stockQuantity: rowData['Qty'] ?? null,
          itemRate: rowData['Item Rate'] ?? null,
          itemValue: rowData['Item Value'] ?? null,
        };

        // Check if Stock entry for this itemCode already exists
        let stock = await Stock.findOne({ model: model._id });

        if (stock) {
          // If stock entry exists, push the new stock data into stockData array
          stock.stockData.push(stockEntry);
          await stock.save();
          console.log(`Updated Stock with Item Code: ${model.itemCode}`);
        } else {
          // If no stock entry exists, create a new Stock document
          stock = new Stock({
            model: model._id,
            itemCode,
            stockData: [stockEntry],
          });
          await stock.save();
          console.log(`Created new Stock for Item Code: ${model.itemCode}`);
        }
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
