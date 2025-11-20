// backend/routes/uploadRoutes.js
import path from "path"
import express from "express"
import multer from "multer" // Library for file uploads

const router = express.Router()

// Multer storage settings
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/") // Folder where images will be saved
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
  },
})

// Function to check file type
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = filetypes.test(file.mimetype)

  if (extname && mimetype) {
    return cb(null, true)
  } else {
    cb("Images only!")
  }
}

// Multer setup for upload
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb)
  },
})

// Route for single image upload
router.post("/", upload.single("image"), (req, res) => {
  // On success, return the accessible path to the image
  // Use `req.file.filename` instead of `req.file.path` to get only the filename,
  // then construct the correct path relative to the `uploads` folder served as static files.
  res.send(`/uploads/${req.file.filename}`)
})

export default router
