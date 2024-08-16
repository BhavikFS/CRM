const express = require("express");
const router = express.Router();
const ModelInfo = require("../../Models/ModelInfo"); // Adjust the path to your ModelInfo model
const Model = require("../../Models/Modal"); // Adjust the path to your Model model

// POST endpoint to create a new request
router.post("/create-model-info", async (req, res) => {
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
    const newModelInfo = new ModelInfo({
      model: modelId,
      requestPrice,
      requestDiscount,
      requestQuantity,
      reasons,
    });

    // Save the ModelInfo to the database
    await newModelInfo.save();
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
router.put('/update-model-info/:id', async (req, res) => {
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
    );

    if (!updatedModelInfo) {
      return res.status(404).json({ error: 'ModelInfo not found' });
    }

    return res.status(200).json({ success: true, data: updatedModelInfo });
  } catch (error) {
    console.error('Error updating model info:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete API for ModelInfo
router.delete('/delete-model-info/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the ModelInfo by id
    const deletedModelInfo = await ModelInfo.findByIdAndDelete(id);

    if (!deletedModelInfo) {
      return res.status(404).json({ error: 'ModelInfo not found' });
    }

    return res.status(200).json({ success: true, message: 'ModelInfo deleted successfully' });
  } catch (error) {
    console.error('Error deleting model info:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});



module.exports = router;
