const mongoose = require('mongoose');
const XLSX = require('xlsx');
const path = require('path');
const cliProgress = require('cli-progress');
const Model = require('./Models/Modal');  // Ensure the correct path to your model file

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

const updateQuantities = async () => {
  try {
    console.log('Quantity update process started.');

    // Load data from Sheet 4
    const data = await processSheet4();
    console.log(`Sheet 4 Data Loaded: ${data.length} rows`);

    // Initialize progress bar
    const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    progressBar.start(data.length, 0);

    // Step 1: Group data by Item Code and accumulate Qty
    const groupedData = data.reduce((acc, row) => {
      const itemCode = row['Item Code'];
      const qty = row['Qty'] || 0;

      if (!acc[itemCode]) {
        acc[itemCode] = qty;
      } else {
        acc[itemCode] += qty;  // Accumulate the Qty for the same Item Code
      }

      return acc;
    }, {});

    // Step 2: Update only the quantity for each unique Item Code
    const uniqueItemCodes = Object.keys(groupedData);
    for (const [index, itemCode] of uniqueItemCodes.entries()) {
      const totalQty = groupedData[itemCode];
      
      // Find the Model by Item Code and update only the quantity
      const model = await Model.findOneAndUpdate(
        { itemCode },  // Find by Item Code
        { quantity: totalQty },  // Update only the quantity
        { new: true }  // Return the updated document
      );

      if (model) {
        console.log(`Updated quantity for Model with Item Code: ${itemCode} to ${totalQty}`);
      } else {
        console.log(`Model not found for Item Code: ${itemCode}`);
      }

      progressBar.update(index + 1);
    }

    progressBar.stop();
    console.log('Quantity update process completed.');
  } catch (error) {
    console.error('Error during quantity update:', error);
  } finally {
    mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
};

updateQuantities();
