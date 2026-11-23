import asyncHandler from "express-async-handler"
import mongoose from "mongoose"
import Product from "../models/Product.js"

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 8
  const page = Math.max(1, Number(req.query.pageNumber) || 1)

  const filter = {}

  if (req.query.keyword) {
    const keyword = String(req.query.keyword)
      .trim()
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

    filter.$or = [
      { name: { $regex: keyword, $options: "i" } },
      { nameAr: { $regex: keyword, $options: "i" } },
    ]
  }

  if (req.query.category) {
    filter.category = String(req.query.category).trim()
  }

  if (req.query.brand) {
    filter.brand = String(req.query.brand).trim()
  }

  const count = await Product.countDocuments(filter)

  const products = await Product.find(filter)
    .sort({ createdAt: -1, _id: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1))

  res.json({
    products,
    page,
    pages: Math.ceil(count / pageSize),
  })
})

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400)
    throw new Error("Invalid product ID")
  }

  const product = await Product.findById(req.params.id)

  if (!product) {
    res.status(404)
    throw new Error("Product not found")
  }

  res.json(product)
})

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    nameAr,
    price,
    description,
    descriptionAr,
    image,
    brand,
    category,
    countInStock,
  } = req.body

  const product = new Product({
    name: name || "Sample name",
    nameAr: nameAr || "",
    price: price ?? 0,
    user: req.user._id,
    image: image || "/placeholder.svg?height=400&width=400",
    brand: brand || "Sample brand",
    category: category || "Sample category",
    countInStock: countInStock ?? 0,
    description: description || "Sample description",
    descriptionAr: descriptionAr || "",
  })

  const createdProduct = await product.save()

  res.status(201).json(createdProduct)
})

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400)
    throw new Error("Invalid product ID")
  }

  const {
    name,
    nameAr,
    price,
    description,
    descriptionAr,
    image,
    brand,
    category,
    countInStock,
  } = req.body

  const product = await Product.findById(req.params.id)

  if (!product) {
    res.status(404)
    throw new Error("Product not found")
  }

  if (name !== undefined) product.name = name
  if (nameAr !== undefined) product.nameAr = nameAr
  if (price !== undefined) product.price = price
  if (description !== undefined) product.description = description
  if (descriptionAr !== undefined) product.descriptionAr = descriptionAr
  if (image !== undefined) product.image = image
  if (brand !== undefined) product.brand = brand
  if (category !== undefined) product.category = category
  if (countInStock !== undefined) product.countInStock = countInStock

  const updatedProduct = await product.save()

  res.json(updatedProduct)
})

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400)
    throw new Error("Invalid product ID")
  }

  const product = await Product.findById(req.params.id)

  if (!product) {
    res.status(404)
    throw new Error("Product not found")
  }

  await product.deleteOne()

  res.json({ message: "Product removed" })
})

// @desc    Create a new product review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body

  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400)
    throw new Error("Invalid product ID")
  }

  const product = await Product.findById(req.params.id)

  if (!product) {
    res.status(404)
    throw new Error("Product not found")
  }

  const numericRating = Number(rating)

  if (
    !Number.isInteger(numericRating) ||
    numericRating < 1 ||
    numericRating > 5
  ) {
    res.status(400)
    throw new Error("Rating must be a number between 1 and 5")
  }

  if (!comment || !String(comment).trim()) {
    res.status(400)
    throw new Error("Review comment is required")
  }

  const alreadyReviewed = product.reviews.find(
    (review) => review.user.toString() === req.user._id.toString()
  )

  if (alreadyReviewed) {
    res.status(400)
    throw new Error("You have already reviewed this product")
  }

  product.reviews.push({
    name: req.user.name,
    rating: numericRating,
    comment: String(comment).trim(),
    user: req.user._id,
  })

  product.numReviews = product.reviews.length

  product.rating =
    product.reviews.reduce(
      (total, review) => total + review.rating,
      0
    ) / product.reviews.length

  await product.save()

  res.status(201).json({ message: "Review added successfully" })
})

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
}