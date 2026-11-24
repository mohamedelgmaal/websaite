# 🛍️ ProShop - Full Stack E-Commerce Website

A modern and responsive full-stack e-commerce application built with React.js, Node.js, Express.js, and MongoDB.

ProShop provides a complete online shopping experience with secure authentication, product management, shopping cart, order management, and PayPal payment integration.

---

## 🚀 Features

### 👤 User Features
- User Registration and Login
- JWT Authentication
- Forgot Password and Reset Password
- Browse and Search Products
- View Product Details
- Add Products to Shopping Cart
- Update Product Quantities
- Remove Products from Cart
- Place Orders
- PayPal Payment Integration
- View Order History
- Responsive User Interface

### 🔐 Admin Features
- Admin Dashboard
- Manage Products
- Add New Products
- Edit Existing Products
- Delete Products
- Manage Orders
- View Order Details
- User Management

### 🌐 Additional Features
- Multi-language Support
- Responsive Design
- Protected Routes
- Global State Management
- Notifications System
- Product Image Upload
- RESTful API

---

## 🛠️ Technologies Used

### Frontend
- React.js 19
- React Router DOM
- Context API
- Axios
- Tailwind CSS
- Lucide React
- React Icons
- GSAP
- PayPal React SDK

### Backend
- Node.js
- Express.js 5
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- Bcrypt.js
- Multer
- Nodemailer
- Dotenv
- Morgan

### Tools
- Git
- GitHub
- GitHub Desktop
- npm

---

## 📁 Project Structure

```text
ProShop/
│
├── frontend/
│   ├── public/
│   ├── src/
│   └── package.json
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── server.js
│   ├── seeder.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone YOUR_REPOSITORY_URL
```

```bash
cd ProShop
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the backend directory and configure the required environment variables.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Add any additional environment variables required by your application, including email and PayPal configuration.

Start the backend development server:

```bash
npm run dev
```

The backend will run on the configured port.

### 3. Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the React development server:

```bash
npm start
```

The frontend will run at:

http://localhost:3000

---

## 💳 Payment Integration

ProShop integrates PayPal to provide an online payment experience.

The application uses:

- PayPal React SDK
- PayPal API

Configure your PayPal credentials before using payment functionality.

---

## 🔒 Security

- Password Hashing with Bcrypt.js
- JWT-Based Authentication
- Protected API Routes
- Environment Variables for Sensitive Configuration
- Secure Credential Management

**Important:** Never upload your `.env` file, database credentials, API keys, or private secrets to GitHub.

---

## 📦 Available Backend Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm start` | Start production server |
| `npm run data:import` | Import seed data |

## 📦 Available Frontend Scripts

| Command | Description |
|---|---|
| `npm start` | Start React application |
| `npm run build` | Create production build |
| `npm test` | Run tests |

---

## 👨‍💻 Development

This project was developed using modern full-stack web development technologies, focusing on clean code, reusable components, responsive design, and a smooth shopping experience.

---

## 📄 License

This project is intended for educational and development purposes.

---

**Built with ❤️ using React, Node.js, Express, and MongoDB.**
