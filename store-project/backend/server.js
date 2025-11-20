// backend/server.js
import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import path from "path"
import connectDB from "./config/db.js"
import userRoutes from "./routes/userRoutes.js"
import productRoutes from "./routes/productRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import uploadRoutes from "./routes/uploadRoutes.js"
import configRoutes from "./routes/configRoutes.js"
import { notFound, errorHandler } from "./middleware/errorMiddleware.js"

// Load environment variables from .env file
dotenv.config()

// New: Log the FRONTEND_URL to the console to verify it's loaded
console.log(`FRONTEND_URL loaded: ${process.env.FRONTEND_URL}`)

// Connect to database
connectDB()

// Initialize Express app
const app = express()

// Middleware
app.use(express.json())
app.use(cors())

// Define Routes
app.use("/api/users", userRoutes)
app.use("/api/products", productRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/upload", uploadRoutes)
app.use("/api/config", configRoutes)

// Simple test route to check if server is running
app.get("/", (req, res) => {
  res.send("API is running...")
})

// New: Make the uploads folder static
// This allows the frontend to access uploaded images
const __dirname = path.resolve()
app.use("/uploads", express.static(path.join(__dirname, "/uploads")))

// Use middleware for handling 404 errors and general errors
app.use(notFound)
app.use(errorHandler)

// Define the port the server will run on
const PORT = process.env.PORT || 5000

// Start the server and listen for requests on the specified port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
