// backend/utils/generateToken.js
import jwt from "jsonwebtoken"

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1h", // Token validity 1 hour
  })
}

export default generateToken
