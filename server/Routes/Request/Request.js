const express = require("express");
const router = express.Router();
const Request = require("../../Models/Request"); // Adjust the path to your ModelInfo model
const User = require("../../Models/User");

router.post("/create-request", async (req, res) => {
  try {
    const {
      party,
      subParty,
      modelInfo,
      pricingUsers,
      financeUsers,
      status,
    } = req.body;

    const pricingUserDocs = await User.find({ _id: { $in: pricingUsers } });
    const financeUserDocs = await User.find({ _id: { $in: financeUsers } });

    // Check that all pricing users have role 'PC'
    const invalidPricingUsers = pricingUserDocs.filter(
      (user) => user.role !== "PC"
    );
    if (invalidPricingUsers.length > 0) {
      return res
        .status(400)
        .json({
          error:
            "Invalid role for pricing users. All pricing users must have the role PC.",
        });
    }

    // Check that all finance users have role 'CO'
    const invalidFinanceUsers = financeUserDocs.filter(
      (user) => user.role !== "CO"
    );
    if (invalidFinanceUsers.length > 0) {
      return res
        .status(400)
        .json({
          error:
            "Invalid role for finance users. All finance users must have the role CO.",
        });
    }

    // Create a new Request document
    const request = new Request({
      party,
      subParty,
      modelInfo,
      pricingUsers,
      financeUsers,
      status,
    });

    // Save the request to the database
    const savedRequest = await request.save();

    res.status(201).json(savedRequest);
  } catch (error) {
    console.error("Error creating request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
