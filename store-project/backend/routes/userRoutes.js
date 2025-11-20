// backend/routes/userRoutes.js
import express from "express"
import {
  registerUser,
  authUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  forgotPassword, // New
  resetPassword, // New
} from "../controllers/userController.js"
import { protect, admin } from "../middleware/authMiddleware.js"
import { refreshToken } from "../controllers/userController.js"

const router = express.Router()

router.post("/register", registerUser)
router.post("/login", authUser)
router.route("/profile").get(protect, getUserProfile).put(protect, updateUserProfile)

router.post("/forgotpassword", forgotPassword) // New: Route for password reset request
router.put("/resetpassword/:resettoken", resetPassword) // New: Route for password reset

router.route("/").get(protect, admin, getUsers)
router.route("/:id").delete(protect, admin, deleteUser)

router.post("/refreshtoken",protect,refreshToken)

export default router
