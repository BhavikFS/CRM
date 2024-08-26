const jwt = require("jsonwebtoken");
const User = require("../Models/User");
const secretKey = "testingFromCRM"; // Use the same secret key used for signing the token

const authenticateToken = async (req, res, next) => {
  const token = req.header("Authorization"); // Extract token from 'Authorization' header
  if (!token) {
    return res.status(401).send({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded; // Attach user info (payload) to request object

    const user = await User.findById(decoded.userId); // Fetch user data based on decoded userId

    if (!user) {
      return res.status(404).send({ error: "User not found." });
    }

    req.user = user; // Attach the full user data to the req object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.log(error, "Token validtion error ");
    res.status(400).send({ error: "Invalid token." });
  }
};

module.exports = authenticateToken;
