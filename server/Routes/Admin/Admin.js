


const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../../Models/Admin'); // Import the Admin model
const bcrypt = require('bcryptjs');
const router = express.Router();

// JWT Secret key
const JWT_SECRET = 'your_jwt_secret_key';

// Admin login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if admin exists
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check if password matches
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { adminId: admin._id },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Return the token
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


// async function createAdmin() {
//     const adminData = {
//         email: 'admin@example.com',
//         password: 'securePassword123'
//     };

//     try {
//         const newAdmin = new Admin(adminData);
//         await newAdmin.save();
//         console.log('Admin record saved:', newAdmin);
//     } catch (error) {
//         console.error('Error saving admin record:', error);
//     }
// }
// createAdmin();

module.exports = router;
