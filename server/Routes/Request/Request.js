const express = require("express");
const router = express.Router();
const Request = require("../../Models/Request"); // Adjust the path to your ModelInfo model
const User = require("../../Models/User");
const Party = require("../../Models/Party");
const SubParty = require("../../Models/SubParty");
const ModelInfo = require("../../Models/ModelInfo");
const authenticateToken = require("../../Middleware/AuthenticateToken");
const mongoose = require("mongoose");
const sendEmailToMultipleUsers = require("../../Utils/sendEmail");
const sendNotification = require("../../Utils/sendNotification");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

router.post("/request-generate", authenticateToken, async (req, res) => {
  const { party, subParty, modelInfo, pricingUsers, financeUsers, lockParty } =
    req.body;

  // Basic validation
  if (!party || !isValidObjectId(party)) {
    return res.status(400).json({ error: "Invalid party ID" });
  }
  if (lockParty === "Yes") {
    if (!subParty || !isValidObjectId(subParty)) {
      return res.status(400).json({ error: "Invalid subParty ID" });
    }
  }
  if (!modelInfo || !Array.isArray(modelInfo) || modelInfo.length === 0) {
    return res
      .status(400)
      .json({ error: "modelInfo is required and must be a non-empty array" });
  }
  if (!pricingUsers || !isValidObjectId(pricingUsers)) {
    return res.status(400).json({ error: "Invalid pricing user ID" });
  }
  if (lockParty === "Yes") {
    if (!financeUsers || !isValidObjectId(financeUsers)) {
      return res.status(400).json({ error: "Invalid finance user ID" });
    }
  }

  try {
    // Create a request for each modelInfo item
    const requests = [];
    const requestID = new mongoose.Types.ObjectId(); // Using MongoDB's ObjectId as a unique identifier

    for (const modelInfoId of modelInfo) {
      if (!isValidObjectId(modelInfoId)) {
        return res.status(400).json({ error: "Invalid modelInfo ID" });
      }

      const financeUserStatus = lockParty === "Yes" ? "pending" : "approved";
      const financeUserPayload = {
        user: lockParty === "Yes" ? financeUsers : null,
        status: financeUserStatus,
      };

      const newRequest = new Request({
        party,
        subParty,
        modelInfo: modelInfoId,
        pricingUsers: { user: pricingUsers, status: "pending" }, // Default status 'pending'
        financeUsers: financeUserPayload, // Default status 'pending'
        status: "pending",
        requestID,
        generatedBy: req.user._id, // Assuming `req.user._id` is available from authentication middleware
      });

      const savedRequest = await newRequest.save();
      requests.push(savedRequest);
      await ModelInfo.findByIdAndUpdate(modelInfoId, {
        requestId: savedRequest._id,
      });
    }

    return res
      .status(201)
      .json({ message: "Requests created successfully", requests });
  } catch (error) {
    console.error("Error creating request:", error);
    return res
      .status(500)
      .json({ error: "An error occurred. Please try again." });
  }
});

// API to get requests filtered by role (PC or CO)
router.get("/requests-list", authenticateToken, async (req, res) => {
  try {
    const userRole = req?.user?.role;
    const statusFilter = req.query.status;
    const sortOrder = req.query.sortBy === "oldest" ? 1 : -1; // Default to newest if not specified
    const searchTerm = req.query.search || ""; // Get search term from query parameters
    const mainStatus = req.query.statusFilter || ""; // Main status filter

    // Get pagination values from query parameters, set defaults if not provided
    const page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 10;
    const skip = (page - 1) * limit;

    if (!userRole) {
      return res.status(400).json({ message: "User role is required" });
    }

    let filter = {};

    // Apply main status filter if provided
    if (mainStatus) {
      filter.status = mainStatus; // Filter by the main `status` field in the schema
    }

    // Set the filter based on the user role
    if (userRole === "PC") {
      filter["pricingUsers.status"] = statusFilter;
      filter['pricingUsers.user'] = req?.user?._id
    } else if (userRole === "CO") {
      filter["financeUsers.status"] = statusFilter;
      filter['financeUsers.user'] = req?.user?._id
    } else if (userRole === "Sales") {
      filter.generatedBy = req?.user?._id;
    } else if (userRole === "Manager") {
      filter.$or = [
        { "financeUsers.status": "ReviewRequired" },
        { "pricingUsers.status": "ReviewRequired" },
      ];
    }

    // Handle search term
    if (searchTerm) {
      const partyIds = await Party.find({
        name: { $regex: searchTerm, $options: "i" },
      }).select("_id");
      filter["party"] = { $in: partyIds };
    }

    // Fetch paginated requests
    const requests = await Request.find(filter)
      .sort({ createdAt: sortOrder })
      .skip(skip) // Pagination: Skip to the correct page
      .limit(limit) // Pagination: Limit the number of results per page
      .populate("party")
      .populate("subParty")
      .populate({
        path: "modelInfo",
        populate: {
          path: "model",
          model: "Model", // Assuming 'Model' is the correct model for modelInfo.model
        },
      })
      .populate("pricingUsers.user")
      .populate("financeUsers.user")
      .populate("generatedBy")
      .populate("manager.user");

    // Count total documents for pagination info
    const totalRequests = await Request.countDocuments(filter);
    const totalPages = Math.ceil(totalRequests / limit);

    res.json({
      requests: requests,
      totalRequests: totalRequests,
      totalPages: totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error });
  }
});

router.post("/update-status", authenticateToken, async (req, res) => {
  try {
    const { id, status, comments, roleToupdate, reasons } = req.body;

    const request = await Request.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }
    sendNotification(`Request ${status}`,`Request Marked ${status} by ${req?.user?.role}`,request?.generatedBy, null ,"Request",status)

    // Update for pricingUsers (PC)
    if (req.user.role === "PC") {
      request.pricingUsers = {
        user: req.user._id,
        status: status,
        comments: comments,
        reasons: reasons,
      };

      switch (status) {
        case "ReviewRequired":
        case "ReviewBack": // Handle ReviewBack as ReviewRequired
          request.status = status;
          break;
        case "rejected":
          request.status = "rejected";
          break;
        case "approved":
          switch (request.financeUsers.status) {
            case "pending":
              request.status = "pending";
              break;
            case "rejected":
              request.status = "rejected";
              break;
            case "ReviewRequired":
            case "ReviewBack": // Handle ReviewBack as ReviewRequired
              request.status = "ReviewRequired";
              break;
            default:
              request.status = "approved";
              break;
          }
          break;
        default:
          break;
      }
    }

    if (req.user.role === "CO") {
      const requests = await Request.find({ requestID: request.requestID });

      if (status === "ReviewRequired" || status === "ReviewBack") {
        await Request.updateMany(
          { requestID: request.requestID },
          {
            $set: {
              financeUsers: {
                user: req.user._id,
                status: status,
                comments: comments,
                reasons: reasons,
              },
              status: status,
            },
          }
        );
      } else {
        for (const reqItem of requests) {
          if (status === "rejected") {
            reqItem.financeUsers = {
              user: req.user._id,
              status: status,
              comments: comments,
            };
            reqItem.status = "Rejected";
          } else if (
            status === "approved" &&
            reqItem.pricingUsers.status === "pending"
          ) {
            reqItem.financeUsers = {
              user: req.user._id,
              status: status,
              comments: comments,
            };
            reqItem.status = "pending";
          } else if (
            status === "approved" &&
            (reqItem.pricingUsers.status === "ReviewRequired" ||
              reqItem.pricingUsers.status === "ReviewBack")
          ) {
            reqItem.financeUsers = {
              user: req.user._id,
              status: status,
              comments: comments,
            };
            reqItem.status = "ReviewRequired";
          } else if (
            status === "approved" &&
            reqItem.pricingUsers.status === "rejected"
          ) {
            reqItem.financeUsers = {
              user: req.user._id,
              status: status,
              comments: comments,
            };
            reqItem.status = "rejected";
          } else {
            reqItem.financeUsers = {
              user: req.user._id,
              status: status,
              comments: comments,
            };
            reqItem.status = "approved";
          }

          await reqItem.save();
        }
      }

      return res.json({
        message: "Requests updated successfully for all CO roles",
        requests,
      });
    }

    // If there is a manager update needed
    let updatedStatusCO = "";
    let updatedStatusPC = "";
    if (req.user.role === "Manager") {
      if (roleToupdate === "CO") {
        // Party Info
        switch (status) {
          case "rejected":
            updatedStatusCO = "rejected";
            break;
          case "approved":
            switch (request.pricingUsers.status) {
              case "pending":
                updatedStatusCO = "pending";
                break;
              case "rejected":
                updatedStatusCO = "rejected";
                break;
              case "ReviewRequired":
              case "ReviewBack": // Handle ReviewBack as ReviewRequired
                updatedStatusCO = "ReviewRequired";
                break;
              default:
                updatedStatusCO = "approved";
                break;
            }
            break;
          default:
            break;
        }
        await Request.updateMany(
          { requestID: request.requestID },
          {
            $set: {
              managerStatusCO: status,
              manager: {
                user: req.user._id,
                status: status,
                comments: comments,
              },
              financeUsers: {
                status: status,
              },
              status: updatedStatusCO,
            },
          }
        );
        return res.json({
          message: "Manager updated all CO requests successfully",
        });
      } else if (roleToupdate === "PC") {
        request.managerStatusPC = status;
        switch (status) {
          case "rejected":
            updatedStatusPC = "rejected";
            break;
          case "approved":
            switch (request.financeUsers.status) {
              case "pending":
                updatedStatusPC = "pending";
                break;
              case "rejected":
                updatedStatusPC = "rejected";
                break;
              case "ReviewRequired":
              case "ReviewBack": // Handle ReviewBack as ReviewRequired
                updatedStatusPC = "ReviewRequired";
                break;
              default:
                updatedStatusPC = "approved";
                break;
            }
            break;
          default:
            break;
        }
        (request.manager = {
          user: req.user._id,
          status: status,
          comments: comments,
        }),
          (request.pricingUsers = {
            status: status,
          }),
          (request.status = updatedStatusPC);
      }
    }


    if (req.user.role != "CO") {
      await request.save();
      res.json({ message: "Request updated successfully", request });
    }
  } catch (error) {
    console.error("Error updating request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/completedRequest", authenticateToken, async (req, res) => {
  try {
    const { requestId } = req.query;
    const { freightCharge, materialInsuranceRate, emailUserList } = req.body;

    // Find the request by ID
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    // Validations
    if (typeof freightCharge !== "number" || freightCharge <= 0) {
      return res
        .status(400)
        .json({ error: "Freight charge must be a positive number" });
    }

    if (
      typeof materialInsuranceRate !== "number" ||
      materialInsuranceRate <= 0
    ) {
      return res
        .status(400)
        .json({ error: "Material insurance rate must be a positive number" });
    }

    if (!Array.isArray(emailUserList) || emailUserList.length === 0) {
      return res
        .status(400)
        .json({ error: "Email user list must be an array of valid user IDs" });
    }

    // Validate each email user is a valid ObjectId and exists in the User model
    for (const userId of emailUserList) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res
          .status(400)
          .json({ error: `Invalid user ID in emailUserList: ${userId}` });
      }

      const userExists = await User.findById(userId);
      if (!userExists) {
        return res
          .status(400)
          .json({ error: `User not found for ID: ${userId}` });
      }
    }

    // Update the request with the new details
    request.freightCharge = freightCharge;
    request.materialInsuranceRate = materialInsuranceRate;
    request.emailUserList = emailUserList;
    request.status = "completed";

    // Save the updated request
    await request.save();

    const recipients = ["pvmaradiya482000@gmail.com"];
    const subject = "Request is completed";
    const message = `<h2>Hello from the CRM , request marked as completed by ${req?.user?.username}</h2>`;

    // Loop through recipients and send email to each one
    recipients.forEach((recipient) => {
      sendEmailToMultipleUsers(recipient, subject, message);
    });

    sendNotification("Request Completed","Request Marked Completed",req?.user?._id, null ,"Request","Completed")
    return res
      .status(200)
      .json({ message: "Request updated and marked as completed", request });
  } catch (error) {
    console.error("Error updating request:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

router.get("/CO/requests-list", authenticateToken, async (req, res) => {
  try {
    const userRole = req?.user?.role;
    const statusFilter = req.query.status;
    const sortOrder = req.query.sortBy === "oldest" ? 1 : -1; // Default to newest if not specified
    const searchTerm = req.query.search || ""; // Get search term from query parameters
    const limit = req?.query?.limit || 10;

    if (userRole != "Manager") {
      return res.status(400).json({ message: "User role is required" });
    }

    let filter = {};

    // Apply status filter logic
    if (statusFilter === "pending") {
      filter = {
        $or: [{ "financeUsers.status": "ReviewRequired" }],
        managerStatusCO: { $exists: false }, // Ensures managerStatusCO is not set
      };
    } else if (statusFilter === "approved") {
      filter["managerStatusCO"] = "approved";
    } else if (statusFilter === "rejected") {
      filter["managerStatusCO"] = "rejected";
    }

    // Apply search term if provided
    if (searchTerm) {
      filter["party.name"] = { $regex: searchTerm, $options: "i" }; // Case-insensitive regex search
    }

    // Fetch requests based on filter and sorting
    const requests = await Request.find(filter)
      .sort({ createdAt: sortOrder })
      .populate("party")
      .populate("subParty")
      .populate({
        path: "modelInfo",
        populate: {
          path: "model",
          model: "Model", // Assuming 'Model' is the correct model for modelInfo.model
        },
      })
      .populate("pricingUsers.user")
      .populate("financeUsers.user")
      .populate("generatedBy")
      .populate("manager.user");

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
    res.status(500).json({ message: "Server Error", error });
  }
});
router.get("/PC/requests-list", authenticateToken, async (req, res) => {
  try {
    const userRole = req?.user?.role;
    const statusFilter = req.query.status;
    const sortOrder = req.query.sortBy === "oldest" ? 1 : -1; // Default to newest if not specified
    const searchTerm = req.query.search || ""; // Get search term from query parameters
    const limit = req?.query?.limit || 10;

    if (userRole != "Manager") {
      return res.status(400).json({ message: "User role is required" });
    }

    let filter = {};

    // Apply status filter logic
    if (statusFilter === "pending") {
      filter = {
        $or: [{ "pricingUsers.status": "ReviewRequired" }],
        managerStatusPC: { $exists: false }, // Ensures managerStatusCO is not set
      };
    } else if (statusFilter === "approved") {
      filter["managerStatusPC"] = "approved";
    } else if (statusFilter === "rejected") {
      filter["managerStatusPC"] = "rejected";
    }

    // Apply search term if provided
    if (searchTerm) {
      filter["party.name"] = { $regex: searchTerm, $options: "i" }; // Case-insensitive regex search
    }

    // Fetch requests based on filter and sorting
    const requests = await Request.find(filter)
      .sort({ createdAt: sortOrder })
      .populate("party")
      .populate("subParty")
      .populate({
        path: "modelInfo",
        populate: {
          path: "model",
          model: "Model", // Assuming 'Model' is the correct model for modelInfo.model
        },
      })
      .populate("pricingUsers.user")
      .populate("financeUsers.user")
      .populate("generatedBy")
      .populate("manager.user");

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
    res.status(500).json({ message: "Server Error", error });
  }
});

router.get("/PC/requests-list", authenticateToken, async (req, res) => {
  try {
    const userRole = req?.user?.role;
    const statusFilter = req.query.status;
    const sortOrder = req.query.sortBy === "oldest" ? 1 : -1; // Default to newest if not specified
    const searchTerm = req.query.search || ""; // Get search term from query parameters
    const limit = req?.query?.limit || 10;
    if (!userRole) {
      return res.status(400).json({ message: "User role is required" });
    }

    let filter = {};

    if (userRole === "PC") {
      filter = { "pricingUsers.status": statusFilter };
    } else if (userRole === "CO") {
      filter = { "financeUsers.status": statusFilter };
    } else if (userRole === "Sales") {
      filter = { generatedBy: req?.user?._id };
    } else if (userRole === "Manager") {
      filter = {
        $or: [
          { "financeUsers.status": "ReviewRequired" },
          { "pricingUsers.status": "ReviewRequired" },
        ],
      };
    }

    if (searchTerm) {
      filter["party.name"] = { $regex: searchTerm, $options: "i" }; // Case-insensitive regex search
    }

    const requests = await Request.find(filter)
      .sort({ createdAt: sortOrder })
      .populate("party")
      .populate("subParty")
      .populate({
        path: "modelInfo",
        populate: {
          path: "model",
          model: "Model", // Assuming 'Model' is the correct model for modelInfo.model
        },
      })
      .populate("pricingUsers.user")
      .populate("financeUsers.user")
      .populate("generatedBy")
      .populate("manager.user");

    const totalRequests = await Request.countDocuments(filter);
    const totalPages = Math.ceil(totalRequests / limit);

    res.json({
      requests: requests,
      totalRequests: totalRequests,
      totalPages: totalPages,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error });
  }
});

module.exports = router;
