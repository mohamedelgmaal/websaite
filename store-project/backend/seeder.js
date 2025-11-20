// backend/seeder.js
import dotenv from "dotenv"
import users from "./data/users.js" // Imports dummy user data
import products from "./data/products.js" // Imports dummy product data
import User from "./models/User.js"
import Product from "./models/Product.js"
import Order from "./models/Order.js" // If you have an Order model, otherwise remove it
import connectDB from "./config/db.js"

dotenv.config()

connectDB()

const importData = async () => {
  try {
    // Delete all existing data first to avoid duplication
    await Order.deleteMany() // If you have an Order model, otherwise remove it
    await Product.deleteMany()
    await User.deleteMany()

    // Add users
    const createdUsers = await User.insertMany(users)

    // Get the admin user (first user in the dummy users list)
    // This links products to the admin user
    const adminUser = createdUsers[0]._id

    // Link products to the admin user before adding them
    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser }
    })

    // Add products
    await Product.insertMany(sampleProducts)

    console.log("Data Imported!".green.inverse) // Colored success message
    process.exit() // Exit process with success
  } catch (error) {
    console.error(`${error}`.red.inverse) // Colored error message
    process.exit(1) // Exit process with failure
  }
}

const destroyData = async () => {
  try {
    // Delete all data
    await Order.deleteMany() // If you have an Order model, otherwise remove it
    await Product.deleteMany()
    await User.deleteMany()

    console.log("Data Destroyed!".red.inverse) // Colored success message
    process.exit() // Exit process with success
  } catch (error) {
    console.error(`${error}`.red.inverse) // Colored error message
    process.exit(1) // Exit process with failure
  }
}

// This part determines which function to run based on command line arguments
// If the script is run with the '-d' argument (e.g., node backend/seeder.js -d), data will be destroyed.
// Otherwise, data will be imported.
if (process.argv[2] === "-d") {
  destroyData()
} else {
  importData()
}
