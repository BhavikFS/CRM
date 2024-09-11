const mongoose = require("mongoose");
const XLSX = require("xlsx");
const path = require("path");
const cliProgress = require("cli-progress");
const Purchase = require("./Models/Purchase"); // Updated to use Purchase schema
const Model = require("./Models/Modal"); // Assuming Model is the referenced model in Purchase

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

// Process Purchase_Data
const processSheet4 = () => {
  return processSheet(path.join(__dirname, "Purchase_Data.xlsx"));
};

const migrateData = async () => {
  try {
    console.log("Migration process started.");

    // Load data from Purchase_Data
    const data = await processSheet4();
    console.log(`Purchase_Data Data Loaded: ${data.length} rows`);

    // Initialize progress bar
    const progressBar = new cliProgress.SingleBar(
      {},
      cliProgress.Presets.shades_classic
    );
    progressBar.start(data.length, 0);

    // Process each row in Purchase_Data
    for (const [index, rowData] of data.entries()) {
      const itemCode = rowData["Material Id"];
      let model = await Model.findOne({ itemCode });

      if (model) {
        const itemRateCalculation = rowData["Amount"] / rowData["Quantity"]
        // Create a purchase entry based on the current row
        const purchaseEntry = {
          purchaseDate: rowData["B.E. Date"]
            ? new Date(rowData["B.E. Date"])
            : null,
          purchaseQty: rowData["Quantity"] ?? null,
          itemRate: itemRateCalculation,
          totalAmount: rowData["Amount"] ?? null,
        };

        // Check if Purchase entry for this itemCode already exists
        let purchase = await Purchase.findOne({ model: model._id });

        if (purchase) {
          // If purchase entry exists, push the new purchase data into stockData array
          purchase.purchaseData.push(purchaseEntry);
          await purchase.save();
          console.log(`Updated Purchase with Material Id: ${model.itemCode}`);
        } else {
          // If no purchase entry exists, create a new Purchase document
          purchase = new Purchase({
            model: model._id,
            itemCode,
            purchaseData: [purchaseEntry],
          });
          await purchase.save();
          console.log(`Created new Purchase for Material Id: ${model.itemCode}`);
        }
      } else {
        console.log(`Model not found for Material Id: ${rowData["Material Id"]}`);
      }

      progressBar.update(index + 1);
    }

    progressBar.stop();
    console.log("Data migration from Purchase_Data completed.");
  } catch (error) {
    console.error("Error during migration:", error);
  } finally {
    mongoose.connection.close();
    console.log("MongoDB connection closed.");
  }
};

migrateData();
