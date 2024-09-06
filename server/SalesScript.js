const mongoose = require('mongoose');
const XLSX = require('xlsx');
const path = require('path');
const Sales = require('./Models/Sales');
const Model = require('./Models/Model'); // Assuming you have a Model schema

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

// Process Sales.xlsx
const processSalesSheet = () => {
  return processSheet(path.join(__dirname, 'Sales (Demo).xlsx')); // Adjust path as needed
};

const migrateSalesData = async () => {
  try {
    console.log('Sales data migration process started.');

    // Load data from Sales.xlsx
    const salesData = await processSalesSheet();
    console.log(`Sales Data Loaded: ${salesData.length} rows`);

    // Process each row in Sales.xlsx
    for (const rowData of salesData) {
      // Find the Model based on the Item_Code
      const model = await Model.findOne({ itemCode: rowData['Item_Code'] });
      
      if (model) {
        // Calculate Item Rate
        const itemRate = rowData['Taxable_Amount'] / rowData['Sent_Qty'];

        // Create a new Sales record
        const salesRecord = new Sales({
          model: model._id,
          salesDate: rowData['Invoice_Dt'],
          totalAmount: rowData['Taxable_Amount'],
          salesQuantity: rowData['Sent_Qty'],
          itemRate: itemRate,
        });

        await salesRecord.save();
        console.log(`Migrated Sales Data for Model: ${model.name}`);
      } else {
        console.log(`Model not found for Item_Code: ${rowData['Item_Code']}`);
      }
    }

    console.log('Sales data migration completed.');
  } catch (error) {
    console.error('Error during sales data migration:', error);
  } finally {
    mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
};

migrateSalesData();
