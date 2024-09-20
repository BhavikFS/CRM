

const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const fs = require("fs");
const csv = require("csv-parser");
const Party = require("../../Models/Party");
const Model = require("../../Models/Modal");
const SubParty = require("../../Models/SubParty");
const AdminVerify = require("../../Middleware/AdminVerify");

const router = express.Router();

// Configure multer for file upload (in-memory)
const upload = multer({ dest: "uploads/" });

// In-memory map and arrays
let partyIdMap = new Map();
let partyArray = [];
let modelArray = [];
const partyDataMap = new Map(); // To store aggregated data for each partyCode
const itemDataMap = new Map(); // To store aggregated data for each itemCode


// Function to clean comma-separated numbers
const cleanNumber = (value) => {
  if (!value) return 0; // If the value is undefined or empty, return 0
  return parseFloat(value.replace(/,/g, '')) || 0;
};

// Function to convert DD-MM-YYYY to YYYY-MM-DD format
const convertDate = (dateStr) => {
  const [day, month, year] = dateStr.split('-');
  return `${year}-${month}-${day}`;
};

// Batch size for bulk operations
const BATCH_SIZE = 1000;
// Combined Upload and Migration API
router.post("/PartyModal", [   AdminVerify ,upload.single("csvFile")], (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const filePath = req.file.path;
  partyIdMap = new Map(); // Reset map
  partyArray = [];
  modelArray = [];

  // Process the CSV file and start migration
  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      try {
        // Process each row and collect data for bulk insert
        if (!partyIdMap.has(row["Party Code"])) {
          partyArray.push({
            name: row["Party Name"],
            partyCode: row["Party Code"],
            city: row["Station"],
          });
          partyIdMap.set(row["Party Code"], null); // Mark partyCode as pending
        }

        // Prepare the model data
        modelArray.push({
          partyCode: row["Party Code"], // Store partyCode for future reference
          name: row["Description"],
          itemCode: row["Item Code"],
          listPrice: row["List Price"],
          discount: row["Disc (%)"],
        });
      } catch (error) {
        console.error(`Error processing row: ${row}, error: ${error}`);
      }
    })
    .on("end", async () => {
      console.log("CSV file read completed. Processing bulk insert...");

      try {
        // Bulk insert Parties
        if (partyArray.length > 0) {
          const insertedParties = await Party.insertMany(partyArray, { ordered: false });
          insertedParties.forEach((party) => {
            partyIdMap.set(party.partyCode, party._id); // Update Map with new Party IDs
          });
        }

        // Replace partyCode in modelArray with actual party ID
        modelArray = modelArray.map((modelData) => ({
          ...modelData,
          party: partyIdMap.get(modelData.partyCode),
          partyCode: undefined, // Remove partyCode field
        }));

        // Bulk insert Models
        if (modelArray.length > 0) {
          await Model.insertMany(modelArray, { ordered: false });
        }

        console.log("Data migration from CSV completed.");
        res.status(200).json({ message: "Data migration completed successfully" });
      } catch (error) {
        console.error("Error during bulk insertion:", error);
        res.status(500).json({ error: "Error during bulk insertion" });
      } finally {
        // Clean up the file
        fs.unlink(filePath, (err) => {
          if (err) console.error("Error deleting file:", err);
        });
      }
    })
    .on("error", (error) => {
      console.error("Error reading the CSV file:", error);
      res.status(500).json({ error: "Error reading the CSV file" });
    });
});

router.post("/SubParty",[   AdminVerify ,upload.single("csvFile")], async (req, res) => {
  // Ensure a file was uploaded
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  const partyIdMap = new Map();
  const subPartyIdMap = new Map();
  let partyArray = [];
  let subPartyArray = [];
  let modelArray = [];

  const filePath = path.join(__dirname, `../../uploads/${req.file.filename}`);

  // Read and process the uploaded CSV file
  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      try {
        const partyCode = row["Party Code"];
        const subPartyCode = row["Ref Sub Party"];
        const subPartyName = row["Ref Sub Party Name"];

        // Check if party exists in the map
        if (!partyIdMap.has(partyCode)) {
          partyArray.push({
            name: row["Party Name"],
            partyCode: row["Party Code"],
            city: row["Station"], // Maps to 'city'
          });
          partyIdMap.set(partyCode, null); // Mark partyCode as pending
        }

        // Check if subParty exists and party is present
        if (subPartyCode && !subPartyIdMap.has(subPartyCode)) {
          subPartyArray.push({
            name: subPartyName,
            city: row["Station"], // Assuming the SubParty shares the same city
            partyCode: partyCode, // Storing partyCode temporarily
          });
          subPartyIdMap.set(subPartyCode, null); // Mark subPartyCode as pending
        }

        // Prepare the model data
        modelArray.push({
          partyCode: row["Party Code"], // Store partyCode for future reference
          subPartyCode: subPartyCode || null, // Store subPartyCode for future reference
          name: row["Description"],
          itemCode: row["Item Code"],
          listPrice: row["List Price"],
          discount: row["Disc (%)"],
        });
      } catch (error) {
        console.error(`Error processing row: ${row}, error: ${error}`);
      }
    })
    .on("end", async () => {
      console.log("CSV file read completed. Processing bulk insert...");

      try {
        // Step 1: Insert parties if not already in the database
        for (let party of partyArray) {
          let existingParty = await Party.findOne({ partyCode: party.partyCode });
          if (!existingParty) {
            const newParty = await Party.create(party);
            partyIdMap.set(party.partyCode, newParty._id); // Store the created Party ID
          } else {
            partyIdMap.set(party.partyCode, existingParty._id); // Use the existing Party ID
          }
        }

        // Step 2: Insert subParties if not already in the database
        for (let subParty of subPartyArray) {
          let partyId = partyIdMap.get(subParty.partyCode);
          let subPartyCode = subParty.subPartyCode;
          if (partyId) {
            let existingSubParty = await SubParty.findOne({ name: subParty.name, party: partyId });
            if (!existingSubParty) {
              const newSubParty = await SubParty.create({
                name: subParty.name,
                city: subParty.city,
                party: partyId,
              });
              subPartyIdMap.set(subPartyCode, newSubParty._id); // Store the created SubParty ID
            } else {
              subPartyIdMap.set(subPartyCode, existingSubParty._id); // Use the existing SubParty ID
            }
          }
        }

        // Step 3: Replace partyCode and subPartyCode in modelArray with actual IDs and insert Models
        modelArray = modelArray.map((modelData) => ({
          ...modelData,
          party: partyIdMap.get(modelData.partyCode),
          subParty: modelData.subPartyCode ? subPartyIdMap.get(modelData.subPartyCode) : null,
          partyCode: undefined, // Remove partyCode field
          subPartyCode: undefined, // Remove subPartyCode field
        }));

        // Step 4: Insert models
        if (modelArray.length > 0) {
          await Model.insertMany(modelArray, { ordered: false });
        }

        // Remove the uploaded file after processing
        fs.unlinkSync(filePath);

        console.log("Data migration from CSV completed.");
        res.status(200).json({ message: "Data migration completed successfully." });
      } catch (error) {
        console.error("Error during bulk insertion:", error);
        res.status(500).json({ error: "Error during bulk insertion", details: error });
      }
    })
    .on("error", (error) => {
      console.error("Error reading the CSV file:", error);
      res.status(500).json({ error: "Error reading the CSV file", details: error });
    });
});

// API Endpoint to upload and process the Sales CSV file
router.post('/sales', [   AdminVerify ,upload.single("csvFile")], (req, res) => {
  // Ensure a file was uploaded
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  const filePath = path.join(__dirname, `../../uploads/${req.file.filename}`);
  let salesBatch = [];

  // Function to process a row
  const processRow = async (row) => {
    try {
      const itemCode = row['Item_Code'];
      const invoiceDate = convertDate(row['Invoice_Date']); // Convert date
      const totalAmount = cleanNumber(row['Taxable_Amount']);
      const salesQuantity = cleanNumber(row['Sent_Qty']);
      const invoiceNumber = row['Invoice_No'];
      const itemRate = salesQuantity ? totalAmount / salesQuantity : 0;

      // Find the corresponding Model document
      const model = await Model.findOne({ itemCode: itemCode });

      if (model) {
        // Create sales document
        salesBatch.push({
          model: model._id, // Reference to Model document
          salesDate: invoiceDate,
          totalAmount: totalAmount,
          salesQuantity: salesQuantity,
          itemRate: itemRate,
          itemCode: itemCode,
          invoiceNumber: invoiceNumber
        });

        // If batch size is reached, write to the database
        if (salesBatch.length >= BATCH_SIZE) {
          await Sales.insertMany(salesBatch);
          salesBatch = []; // Clear the batch array
        }
      } else {
        console.warn(`Model with itemCode ${itemCode} not found.`);
      }
    } catch (error) {
      console.error(`Error processing row: ${JSON.stringify(row)}, error: ${error}`);
    }
  };

  // Read the uploaded CSV file and process rows
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', async (row) => {
      await processRow(row); // Process each row asynchronously
    })
    .on('end', async () => {
      // Insert remaining records
      if (salesBatch.length > 0) {
        await Sales.insertMany(salesBatch);
      }

      // Remove the uploaded file after processing
      fs.unlinkSync(filePath);

      console.log('CSV file read completed. Data migration for Sales is complete.');
      mongoose.connection.close(); // Close the MongoDB connection
      res.status(200).json({ message: 'Data migration for Sales completed successfully.' });
    })
    .on('error', (error) => {
      console.error('Error reading the CSV file:', error);
      res.status(500).json({ error: 'Error reading the CSV file', details: error });
    });
});

// API endpoint to upload and process stock CSV file
router.post('/stock', [   AdminVerify ,upload.single("csvFile")], (req, res) => {
  // Ensure a file is uploaded
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  const filePath = path.join(__dirname, `../../uploads/${req.file.filename}`);

  // Function to process the CSV file
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      try {
        const itemCode = row['Item Code'];
        const stockDate = convertDate(row['Stock Date']); // Convert date
        const qty = cleanNumber(row['Qty']);
        const itemRate = cleanNumber(row['Item Rate']);
        const itemValue = cleanNumber(row['Item Value']);

        if (!itemDataMap.has(itemCode)) {
          itemDataMap.set(itemCode, {
            stockData: [{
              stockDate: stockDate,
              stockQuantity: qty,
              itemRate: itemRate,
              itemValue: itemValue
            }],
            totalQuantity: qty
          });
        } else {
          const existingData = itemDataMap.get(itemCode);
          existingData.stockData.push({
            stockDate: stockDate,
            stockQuantity: qty,
            itemRate: itemRate,
            itemValue: itemValue
          });
          existingData.totalQuantity += qty; // Aggregate total quantity
        }
      } catch (error) {
        console.error(`Error processing row: ${JSON.stringify(row)}, error: ${error}`);
      }
    })
    .on('end', async () => {
      console.log('CSV file read completed. Processing bulk insert and update...');

      try {
        // Step 1: Process Stock updates
        for (let [itemCode, itemData] of itemDataMap.entries()) {
          let stock = await Stock.findOne({ itemCode: itemCode });

          if (stock) {
            // Update existing Stock document
            stock.stockData = itemData.stockData;
            await stock.save();
          } else {
            // Create new Stock document
            await Stock.create({
              itemCode: itemCode,
              stockData: itemData.stockData
            });
          }

          // Step 2: Update Model quantity field
          const model = await Model.findOne({ itemCode: itemCode });
          if (model) {
            model.quantity = itemData.totalQuantity;
            await model.save();
          }
        }

        // Remove the uploaded file after processing
        fs.unlinkSync(filePath);

        console.log('Data migration completed successfully.');
        res.status(200).json({ message: 'Data migration for Stock completed successfully.' });
      } catch (error) {
        console.error('Error during bulk processing:', error);
        res.status(500).json({ error: 'Error during bulk processing', details: error });
      }
    })
    .on('error', (error) => {
      console.error('Error reading the CSV file:', error);
      res.status(500).json({ error: 'Error reading the CSV file', details: error });
    });
});

router.post('/payment',[   AdminVerify ,upload.single("csvFile")], (req, res) => {
  // Ensure a file was uploaded
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  const filePath = path.join(__dirname, `../../uploads/${req.file.filename}`);

  // Function to process the CSV file
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      try {
        const partyCode = row['Party Code'];
        const creditDays = cleanNumber(row['Credit Days']);
        const creditLimit = cleanNumber(row['Credit Limit']);
        const overDue = cleanNumber(row['Over Due']);
        const belowDue = cleanNumber(row['Below Due']);
        const totalOverdue = cleanNumber(row['Total Due']); // Overdue mapped to totalOverdue
        const diffDays = cleanNumber(row['Diff. Days']);
        const totalDebit = overDue + belowDue;
        const totalDue = cleanNumber(row['Total Due']);

        // Aggregate data for each partyCode
        if (!partyDataMap.has(partyCode)) {
          partyDataMap.set(partyCode, {
            count: 1,
            creditDays: creditDays,
            creditLimit: creditLimit,
            overDue: overDue,
            belowDue: belowDue,
            totalOverdue: totalOverdue,
            diffDays: diffDays,
            totalDebit: totalDebit,
            totalDue: totalDue
          });
        } else {
          const existingData = partyDataMap.get(partyCode);
          partyDataMap.set(partyCode, {
            count: existingData.count + 1,
            creditDays: existingData.creditDays + creditDays,
            creditLimit: existingData.creditLimit + creditLimit,
            overDue: existingData.overDue + overDue, // Sum of overdue
            belowDue: existingData.belowDue + belowDue,
            totalOverdue: existingData.totalOverdue + totalOverdue,
            diffDays: Math.max(existingData.diffDays, diffDays), // Maximum diff days
            totalDebit: existingData.totalDebit + totalDebit,
            totalDue: existingData.totalDue + totalDue
          });
        }
      } catch (error) {
        console.error(`Error processing row: ${JSON.stringify(row)}, error: ${error}`);
      }
    })
    .on('end', async () => {
      console.log('CSV file read completed. Processing bulk insert and update...');

      try {
        // Step 1: Process Party updates and calculate averages
        for (let [partyCode, partyData] of partyDataMap.entries()) {
          const existingParty = await Party.findOne({ partyCode });

          // Calculate the average for creditDays and creditLimit
          const averageCreditDays = partyData.creditDays / partyData.count;
          const averageCreditLimit = partyData.creditLimit / partyData.count;

          if (existingParty) {
            // Update the existing party's fields
            existingParty.creditDays = averageCreditDays;
            existingParty.creditLimit = averageCreditLimit;
            existingParty.totalOverdue = partyData.totalOverdue;
            existingParty.diffDays = partyData.diffDays;
            existingParty.totalDebit = partyData.totalDebit;
            await existingParty.save();
          }

          // Step 2: Process Payment inserts
          const existingPayment = await Payment.findOne({ partyCode });
          if (!existingPayment) {
            // Create new Payment record for new data
            await Payment.create({
              partyName: row['Party Name'], // Make sure to provide this field
              partyCode,
              creditDays: averageCreditDays,
              creditLimit: averageCreditLimit,
              overDue: partyData.overDue,
              diffDays: partyData.diffDays,
              belowDue: partyData.belowDue,
              totalDue: partyData.totalDue,
            });
          }
        }

        // Remove the uploaded file after processing
        fs.unlinkSync(filePath);

        console.log('Data migration completed successfully.');
        res.status(200).json({ message: 'Data migration for Payment completed successfully.' });
      } catch (error) {
        console.error('Error during bulk processing:', error);
        res.status(500).json({ error: 'Error during bulk processing', details: error });
      }
    })
    .on('error', (error) => {
      console.error('Error reading the CSV file:', error);
      res.status(500).json({ error: 'Error reading the CSV file', details: error });
    });
});

module.exports = router;
