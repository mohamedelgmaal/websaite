// backend/routes/orderRoutes.js
import express from "express"
import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
} from "../controllers/orderController.js"
import { protect, admin } from "../middleware/authMiddleware.js"

const router = express.Router()

router.route("/").post(protect, addOrderItems).get(protect, admin, getOrders) // New: Add order, get all orders (for admin)
router.route("/myorders").get(protect, getMyOrders) // New: Get current user's orders
router.route("/:id").get(protect, getOrderById) // New: Get order by ID
router.route("/:id/pay").put(protect, updateOrderToPaid) // New: Update order payment status
router.route("/:id/deliver").put(protect, admin, updateOrderToDelivered) // New: Update order delivery status (for admin)

export default router
