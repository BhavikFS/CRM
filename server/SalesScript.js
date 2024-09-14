const mongoose = require("mongoose");
const XLSX = require("xlsx");
const path = require("path");
const Sales = require("./Models/Sales");
const Model = require("./Models/Modal"); // Assuming you have a Model schema
const cliProgress = require('cli-progress');
const moment = require('moment');

const excelDateToJSDate = (serial) => {
  const baseDate = new Date(Date.UTC(1899, 11, 30)); // Excel's base date is December 30, 1899
  return new Date(baseDate.getTime() + (serial * 86400000)); // 86400000 ms in a day
};

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://bhavikfs22:MUoCC3LotV4Z5zBz@cluster0.dbrjpil.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/CRM",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Function to process Excel sheets
const processSheet = (filePath) => {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(sheet);
};

// Process Sales.xlsx
const processSalesSheet = () => {
  return processSheet(path.join(__dirname, "Sales (Demo).xlsx")); // Adjust path as needed
};

const migrateSalesData = async () => {
  try {
    console.log("Sales data migration process started.");

    // Load data from Sales.xlsx
    const salesData = await processSalesSheet();
    console.log(`Sales Data Loaded: ${salesData.length} rows`);

    const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    progressBar.start(salesData.length, 0);

    // Process each row in Sales.xlsx
    for (const [index, rowData] of salesData.entries()) {
      const itemCode = rowData["Item_Code"];

      // Skip records where itemCode is null or empty
      if (!itemCode) {
        console.log(`Skipping record with null or empty Item_Code:`, rowData);
        continue;
      }

      // Find the Model based on the Item_Code
      const model = await Model.findOne({ itemCode });

      // Skip records where model is not found
      if (!model) {
        console.log(
          `Skipping record because Model not found for Item_Code: ${itemCode}`
        );
        continue;
      }

      
      if (model) {
        // Calculate Item Rate and Date
        let salesDate;
      const salesDateSerial = rowData['Invoice_Date'];
      if (typeof salesDateSerial === 'number') {
        salesDate = excelDateToJSDate(salesDateSerial);
      } else {
        // Handle case where the date is already a string or in another format
        salesDate = new Date(salesDateSerial);
      }

      if (!salesDate || isNaN(salesDate.getTime())) {
        console.log(`Invalid date format for Invoice_Date: ${salesDateSerial}`);
        continue;
      }
        const itemRate = rowData["Taxable_Amount"] / rowData["Sent_Qty"];

        // Create a new Sales record
        const salesRecord = new Sales({
          model: model._id,
          itemCode: itemCode,
          salesDate: salesDate,
          totalAmount: rowData["Taxable_Amount"],
          salesQuantity: rowData["Sent_Qty"],
          invoiceNumber: rowData["Invoice_No"],
          itemRate: itemRate,
        });

        // Save the Sales record, even if there are other records for the same Item_Code
        await salesRecord.save();
        console.log(`Migrated Sales Data for Model: ${model.name}`);
        progressBar.update(index + 1);
      } else {
        console.log(`Model not found for Item_Code: ${rowData["Item_Code"]}`);
      }
    }
    progressBar.stop();
    console.log("Sales data migration completed.");
  } catch (error) {
    console.log("Error during sales data migration:", error);
  } finally {
    mongoose.connection.close();
    console.log("MongoDB connection closed.");
  }
};

migrateSalesData();
