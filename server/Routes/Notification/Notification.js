const express = require('express');
const router = express.Router();
const Notification = require('../../Models/Notification');
const authenticateToken = require('../../Middleware/AuthenticateToken');

// Middleware for pagination
const paginate = (req, res, next) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 10; // Default to 10 notifications per page
  const skip = (page - 1) * limit;
  
  req.pagination = { limit, skip };
  next();
};

// GET notifications with pagination and filter by user_id
router.get('/notifications', [authenticateToken,paginate], async (req, res) => {
  try {
    const userId = req?.user?._id; // Assuming the user ID is coming from a logged-in user

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const { limit, skip } = req.pagination;
    
    // Fetch notifications for the user with pagination
    const notifications = await Notification.find({ user_id: userId })
      .sort({ created_at: -1 }) // Sort by most recent first
      .skip(skip)
      .limit(limit);
    
    // Count total notifications for pagination metadata
    const totalNotifications = await Notification.countDocuments({ user_id: userId });

    // Send response with notifications and pagination info
    res.json({
      notifications,
      currentPage: Math.ceil(skip / limit) + 1,
      totalPages: Math.ceil(totalNotifications / limit),
      totalNotifications,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
