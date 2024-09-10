const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../../Models/User"); // Adjust the path as necessary
const authenticateToken = require("../../Middleware/AuthenticateToken");
const router = express.Router();

// Secret key for JWT
const secretKey = "testingFromCRM"; // Replace with your own secret key

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  console.log(email, password);
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ error: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).send({ error: "Invalid email or password" });
    }

    const payload = {
      userId: user._id
    };

    const token = jwt.sign(payload, secretKey);
    // Create a copy of the user object and remove the password field
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;
    res
      .status(200)
      .send({ message: "Login successful", token, user: userWithoutPassword });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get("/get-users", authenticateToken, async (req, res) => {
  try {
    const { role, limit = 10, page = 1 } = req.query;

    // Create a filter object based on the role parameter
    let filter = role && role !== 'all' ? { role } : {};

    // If role is not 'all', exclude the currently authenticated user's ID
    if (role === 'all') {
      filter = { ...filter, _id: { $ne: req.user._id } };
    }
    // Calculate the skip value
    const skip = (page - 1) * limit;

    // Fetch users with pagination
    const users = await User.find(filter)
      .limit(Number(limit))
      .skip(skip);

    // Count total number of documents that match the filter
    const totalUsers = await User.countDocuments(filter);

    const totalPages = Math.ceil(totalUsers / limit);

    if (users.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No users found",
        data: users,
        totalPages,
      });
    }

    return res.status(200).json({ success: true, data: users, totalPages });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = router;
