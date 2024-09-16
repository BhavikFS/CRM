const Notification = require('../Models/Notification')
async function sendNotification (title, body, userId, mentionedUser, type , status) {
  const notificationData = {
    title,
    body,
    user_id: userId,
    mentionedUser: mentionedUser && mentionedUser,
    type: type && type,
    status: status && status
  }
  try {
    await Notification.createNotification(notificationData)
  } catch (error) {
    console.error('Error sending notification:', error)
  }
}

module.exports = sendNotification // Export using CommonJS syntax
