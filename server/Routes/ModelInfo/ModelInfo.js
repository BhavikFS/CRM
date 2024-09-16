const express = require("express");
const router = express.Router();
const ModelInfo = require("../../Models/ModelInfo"); // Adjust the path to your ModelInfo model
const Model = require("../../Models/Modal"); // Adjust the path to your Model model
const authenticateToken = require("../../Middleware/AuthenticateToken");
const Request = require("../../Models/Request"); // Adjust the path to your Model model
const sendNotification = require("../../Utils/sendNotification");

// POST endpoint to create a new request
router.post("/create-model-info", authenticateToken,async (req, res) => {
  try {
    const { modelId, requestPrice, requestDiscount, requestQuantity, reasons } =
      req.body;

    // Validate the input data
    if (
      !modelId ||
      !requestPrice ||
      !requestDiscount ||
      !requestQuantity ||
      !Array.isArray(reasons)
    ) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    // Check if the referenced model exists
    const model = await Model.findById(modelId);
    if (!model) {
      return res.status(404).json({ error: "Model not found" });
    }

    // Create a new ModelInfo
    let newModelInfo = new ModelInfo({
      model: modelId,
      requestPrice,
      requestDiscount,
      requestQuantity,
      reasons,
      generatedBy:req?.user?._id
    });

    // Save the ModelInfo to the database
    await newModelInfo.save();
    newModelInfo = await newModelInfo
    .populate({
      path: 'model',
      populate: [
        { path: 'party', select: 'name' },        // Adjust fields as necessary
        { path: 'subParty', select: 'name' }
      ]
    })

    return res.status(201).json({ success: true, data: newModelInfo });
  } catch (error) {
    console.error("Error creating request:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get('/get-all-model-info', async (req, res) => {
  try {
    // Fetch all ModelInfo from the database
    const modelInfos = await ModelInfo.find()
      .populate({
        path: 'model',
        populate: [
          { path: 'party', select: 'name' }, // Populate the party reference and select the 'name' field
          { path: 'subParty', select: 'name' } // Populate the subParty reference and select the 'name' field
        ]
      });

    if (modelInfos.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No models found',
        data: modelInfos,
      });
    }

    return res.status(200).json({ success: true, data: modelInfos });
  } catch (error) {
    console.error('Error fetching model info:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Update API for ModelInfo
router.put('/update-model-info/:id', authenticateToken, async (req, res) => {
  try {
    const { modelId, requestPrice, requestDiscount, requestQuantity, reasons } = req.body;
    const { id } = req.params;
    // Validate the input data
    if (
      !modelId ||
      !requestPrice ||
      !requestDiscount ||
      !requestQuantity ||
      !Array.isArray(reasons)
    ) {
      return res.status(400).json({ error: 'Invalid input data' });
    }

    // Check if the referenced model exists
    const model = await Model.findById(modelId);
    if (!model) {
      return res.status(404).json({ error: 'Model not found' });
    }

    // Find and update the ModelInfo by id
    const updatedModelInfo = await ModelInfo.findByIdAndUpdate(
      id,
      { model: modelId, requestPrice, requestDiscount, requestQuantity, reasons },
      { new: true, runValidators: true } // Return the updated document and validate fields
    ).populate({
      path: 'model',
      populate: [
        { path: 'party', select: 'name' },        // Adjust fields as necessary
        { path: 'subParty', select: 'name' }
      ]
    }).populate('generatedBy', 'username'); // Populate generatedBy if necessary

    if (!updatedModelInfo) {
      return res.status(404).json({ error: 'ModelInfo not found' });
    }

    if(updatedModelInfo?.requestId){
    // Check if the requestID exists in the Request schema and update its status to "pending"
    const request = await Request.findOneAndUpdate(
      { _id: updatedModelInfo?.requestId }, 
      { status: 'pending' },
      { new: true }
    );


    if (request) {

      let selectedUser ;
      if (request.financeUsers.status === "ReviewBack")
      {
        selectedUser = request?.financeUsers?.user
      }
      else{
        selectedUser = request?.pricingUsers?.user
      }
      // Update approval statuses for pricingUsers and financeUsers if needed
      request.pricingUsers.status = 'pending';
      request.financeUsers.status = 'pending';

      await sendNotification(`Request Resubmitted`,`Request Marked Resubmitted by ${req?.user?.username}`,selectedUser, null ,"Request","Pending")

      await request.save(); // Save the updated request
    }
    

  }
    return res.status(200).json({ success: true, data: updatedModelInfo });
  } catch (error) {
    console.error('Error updating model info:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


// Delete API for ModelInfo
router.delete('/delete-model-info', async (req, res) => {
  try {
    const { ids } = req.body;

    // Validate the input data
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Invalid input data. Please provide an array of IDs.' });
    }

    // Delete the ModelInfo documents that match any of the IDs in the array
    const result = await ModelInfo.deleteMany({ _id: { $in: ids } });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'No ModelInfo found with the provided IDs.' });
    }

    return res.status(200).json({
      success: true,
      message: `${result.deletedCount} ModelInfo document(s) deleted successfully`,
    });
  } catch (error) {
    console.error('Error deleting model info:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/stock-list', async (req, res) => {
  try {
    const { itemCode } = req.query;

    // Validate if ItemCode is provided
    if (!itemCode) {
      return res.status(400).json({ message: "ItemCode is required" });
    }

    // Create the filter based on ItemCode
    const filter = { itemCode: itemCode };

    // Fetch sales data from the Sales collection
    const stockData = await Model.find(filter)

    res.json({
      stock: stockData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
})

router.get('/model-info-list', authenticateToken, async (req, res) => {
  try {
    const { modelID, party, subParty } = req.query;
    const userId = req.user._id;

    if (!modelID || !party) {
      return res.status(400).send({ error: 'ModelID and Party are required.' });
    }

    const model = await Model.findOne({ _id: modelID, party, subParty });

    if (!model) {
      return res.status(404).send({ error: 'Model not found.' });
    }

    const modelInfoList = await ModelInfo.find({
      requestId: { $exists: false }, // Ensure requestId is not present
      generatedBy: userId, // Match the user who generated the request
      model: modelID // Match the model ID
    })
    .populate({
      path: 'model',
      populate: [
        { path: 'party' },
        { path: 'subParty' }
      ]
    });
    res.status(200).send(modelInfoList);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'An error occurred while fetching the model info list.' });
  }
});

module.exports = router;
