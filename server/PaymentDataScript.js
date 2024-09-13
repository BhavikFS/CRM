// scripts/migrateSheet3.js
const mongoose = require("mongoose");
const XLSX = require("xlsx");
const path = require("path");
const cliProgress = require("cli-progress");
const Party = require("./Models/Party");
const Payment = require("./Models/Payment");

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

// Process Sheet 3
const processSheet3 = () => {
  return processSheet(path.join(__dirname, "sheet3.xlsx"));
};

const migrateData = async () => {
  try {
    console.log("Migration process started.");

    // Set all fields to null for every Party initially
    await Party.updateMany(
      {},
      {
        $set: {
          creditDays: null,
          creditLimit: null,
          totalOverdue: null,
          diffDays: null,
          totalDebit: null,
        },
      }
    );
    console.log(
      "Reset creditDays, creditLimit, and totalOverdue to null for all Parties."
    );

    // Load data from Sheet 3
    const data = await processSheet3();
    console.log(`Sheet 3 Data Loaded: ${data.length} rows`);

    // Initialize progress bar
    const progressBar = new cliProgress.SingleBar(
      {},
      cliProgress.Presets.shades_classic
    );
    progressBar.start(data.length, 0);

    // Process each row in Sheet 3
    for (const [index, rowData] of data.entries()) {
      const partyName = rowData["Party Name"];
      const partyCode = rowData["Party Code"];
      const overDue = rowData["Over Due"] ?? 0;
      const belowDue = rowData["Below Due"] ?? 0;
      const creditDays = rowData["Credit Days"] ?? 0;
      const creditLimit = rowData["Credit Limit"] ?? 0;
      const totalDue = rowData["Total Due"] ?? 0;
      const diffDays = rowData["Diff. Days"] ?? 0;
      const totalDebit = overDue + belowDue;
      let payment = await Payment.findOne({ partyCode: partyCode });
      if (!payment) {
        payment = new Payment({
          partyName,
          partyCode,
          creditDays,
          creditLimit,
          overDue,
          diffDays,
          belowDue,
          totalDue,
        });
        await payment.save();
        console.log(`Created new Payment: ${payment.partyName}`);
      } else {
        payment.creditDays = creditDays;
        payment.creditLimit = creditLimit;
        payment.overDue = overDue;
        payment.diffDays = diffDays;
        payment.belowDue = belowDue;
        payment.totalDue = totalDue;
        await payment.save();
        console.log(`Updated Payment: ${payment.partyName}`);
      }
      let party = await Party.findOne({ name: partyName });

      if (party) {
        party.creditDays = creditDays;
        party.creditLimit = creditLimit;
        party.totalOverdue = totalDue;
        party.diffDays = diffDays;
        party.totalDebit = totalDebit;
        await party.save();
        console.log(`Updated Party: ${party.name}`);
      } else {
        console.log(`Party not found: ${partyName}`);
      }

      progressBar.update(index + 1);
    }

    progressBar.stop();
    console.log("Data migration from Sheet 3 completed.");
  } catch (error) {
    console.error("Error during migration:", error);
  } finally {
    mongoose.connection.close();
    console.log("MongoDB connection closed.");
  }
};

migrateData();
