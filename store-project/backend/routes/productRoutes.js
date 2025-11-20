// backend/routes/productRoutes.js
import express from "express"
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview, // New
} from "../controllers/productController.js"
import { protect, admin } from "../middleware/authMiddleware.js"

const router = express.Router()

router.route("/").get(getProducts).post(protect, admin, createProduct)
router.route("/:id/reviews").post(protect, createProductReview) // New: Route to add a product review
router.route("/:id").get(getProductById).put(protect, admin, updateProduct).delete(protect, admin, deleteProduct)

export default router
