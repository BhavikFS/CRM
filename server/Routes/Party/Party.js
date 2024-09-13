const express = require("express");
const Party = require("../../Models/Party"); // Adjust the path as necessary
const SubParty = require("../../Models/SubParty");
const Model = require("../../Models/Modal");
const router = express.Router();

router.get("/get-parties", async (req, res) => {
  try {
    const parties = await Party.find();
    if (!parties.length > 0) {
      return res
        .status(200)
        .json({ success: true, message: "No parties found", data: parties });
    }
    return res.status(200).json({ success: true, data: parties });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/get-sub-parties/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id, "id");

  try {
    const subparties = await SubParty.find({ party: id });
    if (subparties.length === 0) {
      return res
        .status(200)
        .json({ success: true, message: "No subparties found", data: subparties });
    }
    return res.status(200).json({ success: true, data: subparties });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/get-models/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id, "id");

  try {
    const models = await Model.find({ subParty: id });
    if (models.length === 0) {
      return res
        .status(200)
        .json({ success: true, message: "No models found", data: models });
    }
    return res.status(200).json({ success: true, data: models });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/get-models", async (req, res) => {
  const { partyId, subPartyId } = req.body; // Get partyId and subPartyId from request body

  if (!partyId) {
    return res.status(400).json({ success: false, message: "Party ID is required" });
  }

  try {
    if (subPartyId) {
      // If subPartyId is provided, fetch models based on subPartyId
      let models = await Model.find({ subParty: subPartyId });

      if (models.length === 0) {
        // If no models are found for the subPartyId, check if there are subparties for the given partyId
        const subParties = await SubParty.find({ party: partyId });

        if (subParties.length > 0) {
          // If there are subparties for the partyId, throw an error
          return res.status(400).json({
            success: false,
            message: "Subparty is required when there are subparties for the given partyId"
          });
        } else {
          // Fetch models based on the partyId if no models are found for subPartyId
          models = await Model.find({ party: partyId });
        }
      }

      if (models.length === 0) {
        return res
          .status(200)
          .json({ success: true, message: "No models found", data: [] });
      }

      return res.status(200).json({ success: true, data: models });
    } else {
      // If subPartyId is not provided, check if there are subparties for the given partyId
      const subParties = await SubParty.find({ party: partyId });

      if (subParties.length > 0) {
        // If there are subparties for the partyId, throw an error
        return res.status(400).json({
          success: false,
          message: "Subparty is required when there are subparties for the given partyId"
        });
      } else {
        // Fetch models based on the partyId
        const models = await Model.find({ party: partyId });

        if (models.length === 0) {
          return res
            .status(200)
            .json({ success: true, message: "No models found", data: [] });
        }

        return res.status(200).json({ success: true, data: models });
      }
    }
  } catch (error) {
    console.error("Error fetching models:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
