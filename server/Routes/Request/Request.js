const express = require("express");
const router = express.Router();
const Request = require("../../Models/Request"); // Adjust the path to your ModelInfo model
const User = require("../../Models/User");
const Party = require("../../Models/Party")
const SubParty = require("../../Models/SubParty")
const ModelInfo = require("../../Models/ModelInfo");
const authenticateToken = require("../../Middleware/AuthenticateToken");
const mongoose = require('mongoose');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

router.post("/request-generate",authenticateToken,async (req, res) => { 
  const { party, subParty, modelInfo, pricingUsers, financeUsers, status } = req.body;

  // Basic validation
  if (!party || !isValidObjectId(party)) {
    return res.status(400).json({ error: 'Invalid party ID' });
  }
  if (!subParty || !isValidObjectId(subParty)) {
    return res.status(400).json({ error: 'Invalid subParty ID' });
  }
  if (!modelInfo || !Array.isArray(modelInfo) || modelInfo.length === 0) {
    return res.status(400).json({ error: 'modelInfo is required and must be a non-empty array' });
  }
  if (!pricingUsers || !isValidObjectId(pricingUsers)) {
    return res.status(400).json({ error: 'Invalid pricing user ID' });
  }
  if (!financeUsers || !isValidObjectId(financeUsers)) {
    return res.status(400).json({ error: 'Invalid finance user ID' });
  }

  try {
    // Create a request for each modelInfo item
    const requests = [];
    for (const modelInfoId of modelInfo) {
      if (!isValidObjectId(modelInfoId)) {
        return res.status(400).json({ error: 'Invalid modelInfo ID' });
      }

      const newRequest = new Request({
        party,
        subParty,
        modelInfo: modelInfoId,
        pricingUsers: { user: pricingUsers, status: 'pending' }, // Default status 'pending'
        financeUsers: { user: financeUsers, status: 'pending' }, // Default status 'pending'
        status,
        generatedBy: req.user._id, // Assuming `req.user._id` is available from authentication middleware
      });

      const savedRequest = await newRequest.save();
      requests.push(savedRequest);
    }

    return res.status(201).json({ message: 'Requests created successfully', requests });
  } catch (error) {
    console.error('Error creating request:', error);
    return res.status(500).json({ error: 'An error occurred. Please try again.' });
  }
})

// API to get requests filtered by role (PC or CO)
router.get('/requests-list', authenticateToken,async (req, res) => {
  try {
    const userRole = req?.user?.role;
    const statusFilter = req.query.status;
    const sortOrder = req.query.sortBy === 'oldest' ? 1 : -1; // Default to newest if not specified

    if (!userRole) {
      return res.status(400).json({ message: 'User role is required' });
    }

    let filter = {};

    if (userRole === 'PC') {
      filter = { 'pricingUsers.status': statusFilter };
    } else if (userRole === 'CO') {
      filter = { 'financeUsers.status': statusFilter };
    } else if (userRole === "Sales"){
      filter = { 'generatedBy': req?.user?._id };
    }
    else if (userRole === "Manager"){
      filter = {
        $or: [
          { 'financeUsers.status': "ReviewRequired" },
          { 'pricingUsers.status': "ReviewRequired" }
        ]
      };
      }

    const requests = await Request.find(filter).sort({  createdAt: sortOrder }) .populate('party')
    .populate('subParty')
    .populate({
      path: 'modelInfo',
      populate: {
        path: 'model',
        model: 'Model' // Assuming 'Model' is the name of the model associated with modelInfo.model
      }
    })
    .populate('pricingUsers.user')
    .populate('financeUsers.user')
    .populate('generatedBy')
    .populate('manager.user');

    res.json({requests:requests});
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

router.post('/update-status',authenticateToken, async (req, res) => {
  try {
      const {id, status, comments } = req.body;

      const request = await Request.findById(id);
      if (!request) {
          return res.status(404).json({ message: 'Request not found' });
      }

      // Update for pricingUsers
      if (req.user.role === "PC") {
          request.pricingUsers = {
              user: req.user._id,
              status: status,
              comments: comments
          };
      }

      // Update for financeUsers
      if (req.user.role === "CO") {
          request.financeUsers = {
              user: req.user._id,
              status: status,
              comments: comments
          };
      }

      // If there is a manager update needed
      if (req.user.role === "Manager") {
          request.manager = {
              user: req.user._id,
              status: status,
              comments: comments
          };
      }

      // Save the updated request
      await request.save();

      res.json({ message: 'Request updated successfully', request });
  } catch (error) {
      console.error('Error updating request:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});



module.exports = router;
