const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret_key'; // Use the same secret key as in your login route

const AdminVerify = (req, res, next) => {
    // Get the token from the Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET);
        req.adminId = decoded.adminId; // Store the admin ID for later use
        next(); // Call the next middleware or route handler
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = AdminVerify;
