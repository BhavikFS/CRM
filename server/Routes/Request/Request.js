const express = require("express");
const router = express.Router();
const Request = require("../../Models/Request"); // Adjust the path to your ModelInfo model
const User = require("../../Models/User");
const Party = require("../../Models/Party")
const SubParty = require("../../Models/SubParty")
const ModelInfo = require("../../Models/ModelInfo")
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

router.post("/request-generate",  async (req, res) => { 
  try {
    const { party, subParty, modelInfo, pricingUsers, financeUsers, status, generatedBy } = req.body;

    // Validate Party
    const partyExists = await Party.findById(party);
    if (!partyExists) {
      return res.status(400).json({ error: 'Invalid party ID' });
    }

    // Validate Sub Party
    const subPartyExists = await SubParty.findById(subParty);
    if (!subPartyExists) {
      return res.status(400).json({ error: 'Invalid sub party ID' });
    }

    // Validate ModelInfo
    const modelInfoExists = await ModelInfo.find({ _id: { $in: modelInfo } });
    if (modelInfoExists.length !== modelInfo.length) {
      return res.status(400).json({ error: 'One or more ModelInfo IDs are invalid' });
    }

    // Validate Pricing Users
    const pricingUsersExist = await User.find({ _id: { $in: pricingUsers },role:"PC" });
    if (pricingUsersExist.length !== pricingUsers.length) {
      return res.status(400).json({ error: 'One or more Pricing User IDs are invalid' });
    }

    // Validate Finance Users
    const financeUsersExist = await User.find({ _id: { $in: financeUsers ,role:"CO"} });
    if (financeUsersExist.length !== financeUsers.length) {
      return res.status(400).json({ error: 'One or more Finance User IDs are invalid' });
    }

    // Validate Status
    const validStatuses = ['Pending', 'Approved', 'Rejected']; // Adjust based on your business logic
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Validate GeneratedBy User
    const generatedByUserExists = await User.findById(generatedBy);
    if (!generatedByUserExists) {
      return res.status(400).json({ error: 'Invalid generatedBy User ID' });
    }

    // Create Request
    const newRequest = new Request({
      party,
      subParty,
      modelInfo,
      pricingUsers,
      financeUsers,
      status,
      generatedBy,
    });

    const savedRequest = await newRequest.save();

    // Update ModelInfo with the generated requestId
    await ModelInfo.updateMany(
      { _id: { $in: modelInfo } },
      { $set: { requestId: savedRequest._id } }
    );
    res.status(201).json({ message: 'Request created successfully', request: newRequest });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while creating the request' });
  }
})

module.exports = router;
