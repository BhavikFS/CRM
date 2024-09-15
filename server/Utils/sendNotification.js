const Notification = require('../Models/Notification')
async function sendNotification (title, body, userId, modelType, mentionedUser, mentionedUsermodel_type, type) {
  const notificationData = {
    title,
    body,
    user_id: userId,
    model_type: modelType,
    mentionedUser: mentionedUser && mentionedUser,
    mentionedUsermodel_type: mentionedUsermodel_type && mentionedUsermodel_type,
    type: type && type
  }
  try {
    await Notification.createNotification(notificationData)
  } catch (error) {
    console.error('Error sending notification:', error)
  }
}

module.exports = sendNotification // Export using CommonJS syntax
