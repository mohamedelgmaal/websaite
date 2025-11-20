// backend/models/User.js
import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import crypto from "crypto" // New: For using crypto to create reset token

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    resetPasswordToken: String, // New: To store password reset token
    resetPasswordExpire: Date, // New: To store token expiry date
  },
  {
    timestamps: true,
  },
)

// Encrypt password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// Compare entered password with encrypted password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

// New: Create password reset token
userSchema.methods.getResetPasswordToken = function () {
  // Create a random token
  const resetToken = crypto.randomBytes(20).toString("hex")

  // Encrypt the token and save it to the model
  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")

  // Set token expiry date (e.g., 10 minutes)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000 // 10 minutes

  return resetToken // Return the unencrypted token to send via email
}

const User = mongoose.model("User", userSchema)

export default User
