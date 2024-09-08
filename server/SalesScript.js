const mongoose = require("mongoose");
const XLSX = require("xlsx");
const path = require("path");
const Sales = require("./Models/Sales");
const Model = require("./Models/Modal"); // Assuming you have a Model schema
const cliProgress = require('cli-progress');

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
        // Calculate Item Rate
        const itemRate = rowData["Taxable_Amount"] / rowData["Sent_Qty"];

        // Create a new Sales record
        const salesRecord = new Sales({
          model: model._id,
          itemCode: itemCode,
          salesDate: new Date(rowData["Invoice_Date"]),
          totalAmount: rowData["Taxable_Amount"],
          salesQuantity: rowData["Sent_Qty"],
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
