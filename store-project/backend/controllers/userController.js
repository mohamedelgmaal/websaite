// backend/controllers/userController.js
import asyncHandler from "express-async-handler"
import User from "../models/User.js"
import generateToken from "../utils/generateToken.js"
import crypto from "crypto" // For using crypto to create reset token
import sendEmail from "../utils/sendEmail.js" // New: Import sendEmail utility

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error("User already exists")
  }

  const user = await User.create({
    name,
    email,
    password,
  })

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error("Invalid user data")
  }
})

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    })
  } else {
    res.status(401)
    throw new Error("Invalid email or password")
  }
})

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    })
  } else {
    res.status(404)
    throw new Error("User not found")
  }
})

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email

    if (req.body.password) {
      user.password = req.body.password // Will be encrypted by middleware in user model
    }

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    })
  } else {
    res.status(404)
    throw new Error("User not found")
  }
})

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({})
  res.json(users)
})

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    if (user.isAdmin) {
      res.status(400)
      throw new Error("Cannot delete an admin user")
    }
    await user.deleteOne()
    res.json({ message: "User removed" })
  } else {
    res.status(404)
    throw new Error("User not found")
  }
})

// @desc    Request password reset
// @route   POST /api/users/forgotpassword
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body

  const user = await User.findOne({ email })

  if (!user) {
    res.status(404)
    throw new Error("No user with that email")
  }

  // Create password reset token
  const resetToken = user.getResetPasswordToken()
  await user.save() // Save encrypted token and expiry date to database

  // Create reset URL
  const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`

  const message = `
    <h1>You have requested a password reset</h1>
    <p>Please go to this link to reset your password:</p>
    <a href="${resetUrl}" clicktracking="off">${resetUrl}</a>
    <p>This link is valid for 10 minutes.</p>
    <p>If you did not request this, please ignore this email.</p>
  `

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset Request for E-commerce Store",
      message,
    })

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email.",
    })
  } catch (error) {
    console.error(error)
    user.resetPasswordToken = undefined // Clear token if email sending fails
    user.resetPasswordExpire = undefined
    await user.save()
    res.status(500)
    throw new Error("Email could not be sent. Please try again later.")
  }
})

// @desc    Reset password
// @route   PUT /api/users/resetpassword/:resettoken
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const resetPasswordToken = crypto.createHash("sha256").update(req.params.resettoken).digest("hex")

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }, // Ensure token has not expired
  })

  if (!user) {
    res.status(400)
    throw new Error("Invalid or expired password reset token")
  }

  user.password = req.body.password // Will be encrypted by middleware
  user.resetPasswordToken = undefined
  user.resetPasswordExpire = undefined

  await user.save()

  res.status(200).json({
    success: true,
    message: "Password reset successfully. You can now log in with your new password.",
  })
})
// @desc    Refresh user token
// @route   POST /api/users/refresh
// @access  Private
const refreshToken = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    const token = generateToken(user._id)
    res.json({ token })
  } else {
    res.status(404)
    throw new Error("User not found")
  }
})

export {
  registerUser,
  authUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  forgotPassword,
  resetPassword,
  refreshToken,
}
