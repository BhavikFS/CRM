const Payment = require("../../Models/Payment");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { partyCode } = req.query;

    // Validate if PartyCode is provided
    if (!partyCode) {
      return res.status(400).json({ message: "PartyCode is required" });
    }

    // Create the filter based on PartyCode
    const filter = { partyCode: partyCode };

    // Fetch payments data from the Sales collection
    const paymentData = await Payment.find(filter);

    if(paymentData.length > 0){
        return res.json({
            paymentData: paymentData,
            lockParty: "Yes"
        })
    } else {
        return res.json({
            paymentData: paymentData,
            lockParty: "No"
        })
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
