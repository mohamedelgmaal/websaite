// backend/controllers/productController.js
import asyncHandler from "express-async-handler"
import Product from "../models/Product.js"

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 8 // Number of products per page
  const page = Number(req.query.pageNumber) || 1 // Current page number, default is 1

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i", // i for case-insensitive
        },
      }
    : {}

  const category = req.query.category
    ? {
        category: req.query.category,
      }
    : {}

  const brand = req.query.brand
    ? {
        brand: req.query.brand,
      }
    : {}

  const count = await Product.countDocuments({ ...keyword, ...category, ...brand }) // Total number of matching products
  const products = await Product.find({ ...keyword, ...category, ...brand })
    .limit(pageSize)
    .skip(pageSize * (page - 1)) // Skip products for previous pages

  res.json({ products, page, pages: Math.ceil(count / pageSize) }) // Return products, current page number, and total number of pages
})

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (product) {
    res.json(product)
  } else {
    res.status(404)
    throw new Error("Product not found")
  }
})

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } = req.body

  const product = new Product({
    name: name || "Sample name",
    price: price || 0,
    user: req.user._id,
    image: image || "/placeholder.svg?height=400&width=400",
    brand: brand || "Sample brand",
    category: category || "Sample category",
    countInStock: countInStock || 0,
    description: description || "Sample description",
  })

  const createdProduct = await product.save()
  res.status(201).json(createdProduct)
})

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } = req.body

  const product = await Product.findById(req.params.id)

  if (product) {
    product.name = name || product.name
    product.price = price || product.price
    product.description = description || product.description
    product.image = image || product.image // Image can be updated here
    product.brand = brand || product.brand
    product.category = category || product.category
    product.countInStock = countInStock || product.countInStock

    const updatedProduct = await product.save()
    res.json(updatedProduct)
  } else {
    res.status(404)
    throw new Error("Product not found")
  }
})

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (product) {
    await product.deleteOne()
    res.json({ message: "Product removed" })
  } else {
    res.status(404)
    throw new Error("Product not found")
  }
})

// @desc    Create a new product review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body

  const product = await Product.findById(req.params.id)

  if (product) {
    const alreadyReviewed = product.reviews.find((r) => r.user.toString() === req.user._id.toString())

    if (alreadyReviewed) {
      res.status(400)
      throw new Error("You have already reviewed this product")
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    }

    product.reviews.push(review)
    product.numReviews = product.reviews.length
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

    await product.save()
    res.status(201).json({ message: "Review added successfully" })
  } else {
    res.status(404)
    throw new Error("Product not found")
  }
})

export { getProducts, getProductById, createProduct, updateProduct, deleteProduct, createProductReview }
