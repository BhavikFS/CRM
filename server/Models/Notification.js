const mongoose = require('mongoose')

const NotificationSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref:"User" },
  mentionedUser: { type: mongoose.Schema.Types.ObjectId,  ref:"User" },
  type: {
    type: String
  },
  isRead: {
    type: Boolean,
    default: false // Default to unread
  },
  created_at: {
    type: Date,
    default: Date.now
  }
})
// Create a static method on the schema to add a notification
NotificationSchema.statics.createNotification = async function (notificationData) {
  try {
    const notification = new this(notificationData)
    await notification.save()
    return notification
  } catch (error) {
    // handle error
    console.error('Error creating notification:', error)
    throw error
  }
}
module.exports = mongoose.model(
  'Notification', NotificationSchema, 'Notification')
