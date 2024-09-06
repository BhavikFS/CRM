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
    const requestID = new mongoose.Types.ObjectId(); // Using MongoDB's ObjectId as a unique identifier

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
        status:"pending",
        requestID,
        generatedBy: req.user._id, // Assuming `req.user._id` is available from authentication middleware
      });

      const savedRequest = await newRequest.save();
      requests.push(savedRequest);
      await ModelInfo.findByIdAndUpdate(modelInfoId, { requestId: savedRequest._id });
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
    const searchTerm = req.query.search || ''; // Get search term from query parameters
    const limit = req?.query?.limit || 10
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

      if (searchTerm) {
        filter['party.name'] = { $regex: searchTerm, $options: 'i' }; // Case-insensitive regex search
      }
  

    const requests = await Request.find(filter).sort({  createdAt: sortOrder }) .populate('party')
    .populate('subParty')
    .populate({
      path: 'modelInfo',
      populate: {
        path: 'model',
        model: 'Model' // Assuming 'Model' is the correct model for modelInfo.model
      }
    })
    .populate('pricingUsers.user')
    .populate('financeUsers.user')
    .populate('generatedBy')
    .populate('manager.user');

    const totalRequests = await Request.countDocuments(filter);
    const totalPages = Math.ceil(totalRequests / limit);

    res.json({requests:requests,totalRequests: totalRequests,
      totalPages: totalPages,});
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Server Error', error });
  }
});

router.post('/update-status',authenticateToken, async (req, res) => {
  try {
      const {id, status, comments,roleToupdate } = req.body;

      const request = await Request.findById(id);
      if (!request) {
          return res.status(404).json({ message: 'Request not found' });
      }

      // Update for pricingUsers (PC)
      if (req.user.role === "PC") {
        request.pricingUsers = {
          user: req.user._id,
          status: status,
          comments: comments
        };
  
        if(status === "ReviewRequired")
  {
    request.status = "ReviewRequired";
  
  }else{
        if (status === "rejected") {
          request.status = "rejected";
        }
        else if (status === "approved" && request.financeUsers.status === "pending") 
        {
          request.status = "pending";
        }
        else if (status === "approved" && request.financeUsers.status === "rejected"){
          request.status = "rejected";
        }
        else if (status === "approved" && reqItem.financeUsers.status === "ReviewRequired") {
          request.status = "ReviewRequired";
        }
        else{
          request.status = "approved";
        }
     
      }
  
      }
  
      if (req.user.role === "CO") {
        const requests = await Request.find({ requestID: request.requestID });
  
        if (status === "ReviewRequired") {
          await Request.updateMany(
            { requestID: request.requestID },  // Find all requests with the same requestID
            {
              $set: {
                financeUsers: {
                  user: req.user._id,
                  status: status,
                  comments: comments
                },
                status: "ReviewRequired"
              }
            }
          );
        } else {
          // Loop through all requests and update them based on specific conditions
          for (const reqItem of requests) {
            if (status === "rejected") {
              reqItem.financeUsers = {
                user: req.user._id,
                status: status,
                comments: comments
              };
              reqItem.status = "Rejected";
            } else if (status === "approved" && reqItem.pricingUsers.status === "pending") {
              reqItem.financeUsers = {
                user: req.user._id,
                status: status,
                comments: comments
              };
              reqItem.status = "pending";
            } 
            else if (status === "approved" && reqItem.pricingUsers.status === "ReviewRequired") {
              reqItem.financeUsers = {
                user: req.user._id,
                status: status,
                comments: comments
              };
              reqItem.status = "ReviewRequired";
            }
            else if (status === "approved" && reqItem.pricingUsers.status === "rejected") {
              reqItem.financeUsers = {
                user: req.user._id,
                status: status,
                comments: comments
              };
              reqItem.status = "rejected";
            } else {
              reqItem.financeUsers = {
                user: req.user._id,
                status: status,
                comments: comments
              };
              reqItem.status = "approved";
            }
  
            await reqItem.save();  // Save each updated request
          }
        }
  
        return res.json({ message: 'Requests updated successfully for all CO roles', requests });
      }
  

      // If there is a manager update needed
      if (req.user.role === "Manager") {
        if (roleToupdate === 'CO') {
          // Update managerStatusCO for all requests with the same requestID
          await Request.updateMany(
            { requestID: request.requestID }, // Find all requests with the same requestID
            {
              $set: {
                managerStatusCO: status,
                manager: {
                  user: req.user._id,
                  status: status,
                  comments: comments,
                },
                status:status
              },
            }
          );
          return res.json({ message: 'Manager updated all CO requests successfully' });
        } else if (roleToupdate === 'PC') {
          // Update managerStatusPC for only this specific request
          request.managerStatusPC = status;
          request.manager = {
            user: req.user._id,
            status: status,
            comments: comments,
          };
          request.status = status
        }
      }

      if (req.user.role != "CO") {
      // Save the updated request
      await request.save();

      res.json({ message: 'Request updated successfully', request });
      }
  } catch (error) {
      console.error('Error updating request:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});
router.get('/CO/requests-list', authenticateToken, async (req, res) => {
  try {
    const userRole = req?.user?.role;
    const statusFilter = req.query.status;
    const sortOrder = req.query.sortBy === 'oldest' ? 1 : -1; // Default to newest if not specified
    const searchTerm = req.query.search || ''; // Get search term from query parameters
    const limit = req?.query?.limit || 10;
    
    if (userRole != "Manager") {
      return res.status(400).json({ message: 'User role is required' });
    }

    let filter = {};

    // Apply status filter logic
    if (statusFilter === 'pending') {
      filter = {
        $or: [
          { 'financeUsers.status': "ReviewRequired" },
        ],
        managerStatusCO: { $exists: false } // Ensures managerStatusCO is not set
      };
    } else if (statusFilter === 'approved') {
      filter['managerStatusCO'] = 'approved';
    } else if (statusFilter === 'rejected') {
      filter['managerStatusCO'] = 'rejected';
    }

    // Apply search term if provided
    if (searchTerm) {
      filter['party.name'] = { $regex: searchTerm, $options: 'i' }; // Case-insensitive regex search
    }

    // Fetch requests based on filter and sorting
    const requests = await Request.find(filter)
      .sort({ createdAt: sortOrder })
      .populate('party')
      .populate('subParty')
      .populate({
        path: 'modelInfo',
        populate: {
          path: 'model',
          model: 'Model' // Assuming 'Model' is the correct model for modelInfo.model
        }
      })
      .populate('pricingUsers.user')
      .populate('financeUsers.user')
      .populate('generatedBy')
      .populate('manager.user');

    // Count total requests and calculate total pages
    const totalRequests = await Request.countDocuments(filter);
    const totalPages = Math.ceil(totalRequests / limit);

    res.json({
      requests: requests,
      totalRequests: totalRequests,
      totalPages: totalPages,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error', error });
  }
});
router.get('/PC/requests-list', authenticateToken, async (req, res) => {
  try {
    const userRole = req?.user?.role;
    const statusFilter = req.query.status;
    const sortOrder = req.query.sortBy === 'oldest' ? 1 : -1; // Default to newest if not specified
    const searchTerm = req.query.search || ''; // Get search term from query parameters
    const limit = req?.query?.limit || 10;
    
    if (userRole != "Manager") {
      return res.status(400).json({ message: 'User role is required' });
    }

    let filter = {};

    // Apply status filter logic
    if (statusFilter === 'pending') {
      filter = {
        $or: [
          { 'pricingUsers.status': "ReviewRequired" }
        ],
        managerStatusPC: { $exists: false } // Ensures managerStatusCO is not set
      };
    } else if (statusFilter === 'approved') {
      filter['managerStatusPC'] = 'approved';
    } else if (statusFilter === 'rejected') {
      filter['managerStatusPC'] = 'rejected';
    }

    // Apply search term if provided
    if (searchTerm) {
      filter['party.name'] = { $regex: searchTerm, $options: 'i' }; // Case-insensitive regex search
    }

    // Fetch requests based on filter and sorting
    const requests = await Request.find(filter)
      .sort({ createdAt: sortOrder })
      .populate('party')
      .populate('subParty')
      .populate({
        path: 'modelInfo',
        populate: {
          path: 'model',
          model: 'Model' // Assuming 'Model' is the correct model for modelInfo.model
        }
      })
      .populate('pricingUsers.user')
      .populate('financeUsers.user')
      .populate('generatedBy')
      .populate('manager.user');

    // Count total requests and calculate total pages
    const totalRequests = await Request.countDocuments(filter);
    const totalPages = Math.ceil(totalRequests / limit);

    res.json({
      requests: requests,
      totalRequests: totalRequests,
      totalPages: totalPages,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error', error });
  }
});


router.get('/PC/requests-list', authenticateToken,async (req, res) => {
  try {
    const userRole = req?.user?.role;
    const statusFilter = req.query.status;
    const sortOrder = req.query.sortBy === 'oldest' ? 1 : -1; // Default to newest if not specified
    const searchTerm = req.query.search || ''; // Get search term from query parameters
    const limit = req?.query?.limit || 10
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

      if (searchTerm) {
        filter['party.name'] = { $regex: searchTerm, $options: 'i' }; // Case-insensitive regex search
      }
  

    const requests = await Request.find(filter).sort({  createdAt: sortOrder }) .populate('party')
    .populate('subParty')
    .populate({
      path: 'modelInfo',
      populate: {
        path: 'model',
        model: 'Model' // Assuming 'Model' is the correct model for modelInfo.model
      }
    })
    .populate('pricingUsers.user')
    .populate('financeUsers.user')
    .populate('generatedBy')
    .populate('manager.user');

    const totalRequests = await Request.countDocuments(filter);
    const totalPages = Math.ceil(totalRequests / limit);

    res.json({requests:requests,totalRequests: totalRequests,
      totalPages: totalPages,});
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Server Error', error });
  }
});



module.exports = router;
