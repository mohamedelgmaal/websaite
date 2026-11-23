import express from "express"
import {
  createPayPalOrder,
  capturePayPalOrder,
} from "../controllers/paypalController.js"
import {
  getPayPalOrderStatus,
} from "../controllers/paypalStatusController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/:id/create", protect, createPayPalOrder)
router.post("/:id/capture", protect, capturePayPalOrder)
router.get("/:id/status", protect, getPayPalOrderStatus)

export default router