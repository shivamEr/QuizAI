// backend/routes/resultRoutes.js
const express = require("express");
const { submitQuiz, getMyResults, getResultById } = require("../controllers/resultController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// @route   POST /api/results
// @desc    Submit a completed quiz and get the result
// @access  Private
router.post("/", protect, submitQuiz);

// @route   GET /api/results
// @desc    Get all results for the logged-in user
// @access  Private
router.get("/", protect, getMyResults);

// @route   GET /api/results/:id
// @desc    Get a single result by its ID
// @access  Private
router.get("/:id", protect, getResultById);


module.exports = router;