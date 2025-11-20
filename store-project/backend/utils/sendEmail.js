// backend/utils/sendEmail.js
import nodemailer from "nodemailer"

const sendEmail = async (options) => {
  // 1. Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.NODE_ENV === "production", // Use 'true' for 465, 'false' for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      // Do not fail on invalid certs
      rejectUnauthorized: false,
    },
  })

  // 2. Define the email options
  const mailOptions = {
    from: `E-commerce Store <${process.env.EMAIL_USER}>`, // Sender address
    to: options.email, // List of receivers
    subject: options.subject, // Subject line
    html: options.message, // HTML body
  }

  // 3. Send the email
  await transporter
    .sendMail(mailOptions)
    .then((info) => {
      console.log("Email sent: %s", info.messageId)
    })
    .catch((error) => {
      console.error("Error sending email:", error)
      throw error // Re-throw the error so it can be caught by the calling function (forgotPassword)
    })
}

export default sendEmail
