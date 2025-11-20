// backend/data/users.js
import bcrypt from "bcryptjs" // For password encryption

const users = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: bcrypt.hashSync("123456", 10), // Encrypted password: "123456"
    isAdmin: true, // This user will be an admin
  },
  {
    name: "John Doe",
    email: "john@example.com",
    password: bcrypt.hashSync("123456", 10), // Encrypted password: "123456"
    isAdmin: false,
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    password: bcrypt.hashSync("123456", 10), // Encrypted password: "123456"
    isAdmin: false,
  },
]

export default users
