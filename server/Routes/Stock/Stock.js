const Stock = require("../../Models/Stock");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { itemCode } = req.query;

    // Validate if ItemCode is provided
    if (!itemCode) {
      return res.status(400).json({ message: "ItemCode is required" });
    }

    // Create the filter based on ItemCode
    const filter = { itemCode: itemCode };

    // Fetch stocks data from the Sales collection
    const stocksData = await Stock.find(filter)

    // Count total stocks matching the filter

    // Respond with the data
    res.json({
      stocks: stocksData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
