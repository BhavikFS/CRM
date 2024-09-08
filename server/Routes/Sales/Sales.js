const Sales = require("../../Models/Sales");
const express = require("express");
const router = express.Router();

router.get("/sales", async (req, res) => {
  try {
    const { itemCode } = req.query;

    // Validate if ItemCode is provided
    if (!itemCode) {
      return res.status(400).json({ message: "ItemCode is required" });
    }

    // Create the filter based on ItemCode
    const filter = { itemCode: itemCode };

    // Fetch sales data from the Sales collection
    const salesData = await Sales.find(filter)
      .sort({ salesDate: -1 }) // Sort by salesDate descending
      .limit(5); // Limit the result to 5 records
    // .populate("model")

    // Count total sales matching the filter

    // Respond with the data
    res.json({
      sales: salesData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
