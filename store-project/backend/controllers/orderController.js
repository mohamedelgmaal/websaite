import asyncHandler from "express-async-handler"
import mongoose from "mongoose"
import Order from "../models/Order.js"
import User from "../models/User.js"
import Product from "../models/Product.js"

const roundMoney = (value) =>
  Math.round((value + Number.EPSILON) * 100) / 100

// Create new order
const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body

  if (!Array.isArray(orderItems) || orderItems.length === 0) {
    res.status(400)
    throw new Error("No order items")
  }

  // PayPal is the only supported payment method
  if (paymentMethod !== "PayPal") {
    res.status(400)
    throw new Error("Only PayPal payment is supported")
  }

  // Validate shipping address fields
  const requiredAddressFields = [
    "address",
    "city",
    "postalCode",
    "country",
  ]

  if (
    !shippingAddress ||
    typeof shippingAddress !== "object" ||
    requiredAddressFields.some(
      (field) =>
        typeof shippingAddress[field] !== "string" ||
        !shippingAddress[field].trim()
    )
  ) {
    res.status(400)
    throw new Error("Valid shipping address is required")
  }

  const cleanShippingAddress = {
    address: shippingAddress.address.trim(),
    city: shippingAddress.city.trim(),
    postalCode: shippingAddress.postalCode.trim(),
    country: shippingAddress.country.trim(),
  }

  // Validate product IDs and quantities
  const quantities = new Map()

  for (const item of orderItems) {
    if (
      !item ||
      !item._id ||
      !mongoose.Types.ObjectId.isValid(item._id) ||
      !Number.isInteger(Number(item.qty)) ||
      Number(item.qty) <= 0
    ) {
      res.status(400)
      throw new Error("Invalid product or quantity")
    }

    const productId = item._id.toString()
    const currentQty = quantities.get(productId) || 0

    quantities.set(productId, currentQty + Number(item.qty))
  }

  const productIds = [...quantities.keys()]

  // Fetch trusted product data from MongoDB
  const products = await Product.find({
    _id: { $in: productIds },
  })

  if (products.length !== productIds.length) {
    res.status(400)
    throw new Error("One or more products were not found")
  }

  const orderItemsFromDB = []
  let itemsPrice = 0

  for (const product of products) {
    const qty = quantities.get(product._id.toString())

    if (qty > product.countInStock) {
      res.status(400)
      throw new Error(`Insufficient stock for ${product.name}`)
    }

    if (!Number.isFinite(product.price) || product.price < 0) {
      res.status(400)
      throw new Error(`Invalid price for ${product.name}`)
    }

    orderItemsFromDB.push({
      name: product.name,
      qty,
      image: product.image,
      price: product.price,
      product: product._id,
    })

    itemsPrice += product.price * qty
  }

  itemsPrice = roundMoney(itemsPrice)

  // Keep the existing store pricing rules
  const shippingPrice = itemsPrice > 100 ? 0 : 10
  const taxPrice = roundMoney(itemsPrice * 0.15)
  const totalPrice = roundMoney(
    itemsPrice + shippingPrice + taxPrice
  )

  const order = new Order({
    user: req.user._id,
    orderItems: orderItemsFromDB,
    shippingAddress: cleanShippingAddress,
    paymentMethod: "PayPal",
    currency: "USD",
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  })

  const createdOrder = await order.save()

  res.status(201).json(createdOrder)
})

// Get order by ID
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  )

  if (!order) {
    res.status(404)
    throw new Error("Order not found")
  }

  if (
    !order.user ||
    (
      order.user._id.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    )
  ) {
    res.status(403)
    throw new Error("Not authorized to access this order")
  }

  res.json(order)
})

// Disable the old insecure client-side payment confirmation
const updateOrderToPaid = asyncHandler(async (req, res) => {
  res.status(410)
  throw new Error(
    "This payment endpoint is no longer supported. Use PayPal server-side capture."
  )
})

// Update order to delivered
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (!order) {
    res.status(404)
    throw new Error("Order not found")
  }

  order.isDelivered = true
  order.deliveredAt = Date.now()

  const updatedOrder = await order.save()
  res.json(updatedOrder)
})

// Get logged-in user's orders
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
  res.json(orders)
})

// Get all orders (admin)
const getOrders = asyncHandler(async (req, res) => {
  const { userEmail, isDelivered, startDate, endDate } = req.query

  const query = {}
  const dateQuery = {}

  if (userEmail) {
    const escapedEmail = userEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

    const users = await User.find({
      email: { $regex: escapedEmail, $options: "i" },
    }).select("_id")

    const userIds = users.map((user) => user._id)

    if (userIds.length > 0) {
      query.user = { $in: userIds }
    } else {
      return res.json([])
    }
  }

  if (isDelivered === "true" || isDelivered === "false") {
    query.isDelivered = isDelivered === "true"
  }

  if (startDate) {
    const parsedStartDate = new Date(startDate)

    if (Number.isNaN(parsedStartDate.getTime())) {
      res.status(400)
      throw new Error("Invalid start date")
    }

    dateQuery.$gte = parsedStartDate
  }

  if (endDate) {
    const parsedEndDate = new Date(endDate)

    if (Number.isNaN(parsedEndDate.getTime())) {
      res.status(400)
      throw new Error("Invalid end date")
    }

    parsedEndDate.setHours(23, 59, 59, 999)
    dateQuery.$lte = parsedEndDate
  }

  if (Object.keys(dateQuery).length > 0) {
    query.createdAt = dateQuery
  }

  const orders = await Order.find(query).populate(
    "user",
    "id name email"
  )

  res.json(orders)
})

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
}