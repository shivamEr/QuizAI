const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();

// --- CORS Configuration ---
// This is the new, updated section.
// We are whitelisting your live Vercel frontend and your local development server.
const allowedOrigins = [
  'https://mind-quest-nine.vercel.app', 
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);

    // Check if the origin is in our allowed list
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));
// -------------------------

// Middleware
app.use(express.json());

// Import Routes
const authRoutes = require("./backend/routes/authRoutes");
const quizRoutes = require("./backend/routes/quizRoutes");
const resultRoutes = require("./backend/routes/resultRoutes");

// Health check
app.get("/", (req, res) => {
  res.send("Quiz App Backend Running ✅");
});

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/results", resultRoutes);

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => {
    console.error("MongoDB connection error ❌", err.message);
    process.exit(1);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));