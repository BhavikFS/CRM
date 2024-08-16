const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../../Models/User"); // Adjust the path as necessary
const router = express.Router();

// Secret key for JWT
const secretKey = "your_secret_key"; // Replace with your own secret key

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
      userId: user._id,
      role: user.role,
    };

    const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });
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

router.get("/get-users", async (req, res) => {
  try {
    const { role } = req.query;

    // Create a filter object based on the role parameter
    const filter = role && role !== 'all' ? { role } : {};

    // Fetch users from the User model with the created filter
    const users = await User.find(filter);

    if (users.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No users found",
        data: users,
      });
    }

    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
