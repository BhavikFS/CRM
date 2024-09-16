const nodemailer = require("nodemailer");

// Create reusable transporter object using Gmail's SMTP service
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER, // Your Gmail address (environment variable)
    pass: process.env.GMAIL_PASSWORD, // Your Gmail password (environment variable)
  },
});

const sendEmailToMultipleUsers = async (recipientEmails, subject, message) => {
  console.log(process.env.GMAIL_USER, process.env.GMAIL_PASSWORD);
  const mailOptions = {
    from: '"CRM" <priti@lauruss.com>', // Sender's name and email
    to: recipientEmails, // Join multiple email addresses with commas
    subject: subject, // Subject of the email
    html: message, // HTML body of the email
  };

  try {
    // Send email using nodemailer
    const info = await transporter.sendMail(mailOptions);
    console.log("Emails sent successfully:", info.messageId);
  } catch (error) {
    console.error("Error while sending email:", error);
  }
};

// Export the function for external usage
module.exports = sendEmailToMultipleUsers;
