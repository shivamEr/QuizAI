// backend/routes/quizRoutes.js
const express = require("express");
const router = express.Router();
const {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  generateQuestionsWithAI,
  getQuizAnalytics,
  deleteQuiz, // Import the new analytics function
} = require("../controllers/quizController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// @route   POST /api/quizzes
// @desc    Create a new quiz
// @access  Private (Teachers only)
router.post("/", protect, authorizeRoles("teacher"), createQuiz);

// @route   GET /api/quizzes
// @desc    Get all quizzes
// @access  Private
router.get("/", protect, getAllQuizzes);

// @route   GET /api/quizzes/:id
// @desc    Get single quiz by ID
// @access  Private
router.get("/:id", protect, getQuizById);

// @route   POST /api/quizzes/ai-generate
// @desc    Generate quiz questions using AI
// @access  Private (Teachers only)
router.post("/generate-questions", protect, authorizeRoles("teacher"), generateQuestionsWithAI);

// @route   GET /api/quizzes/:id/analytics
// @desc    Get analytics for a specific quiz
// @access  Private (Teachers only)
router.get("/:id/analytics", protect, authorizeRoles("teacher"), getQuizAnalytics);

// @route   DELETE /api/quizzes/:id
// @desc    Delete a quiz
// @access  Private (Teachers only)
router.delete("/:id", protect, authorizeRoles("teacher"), deleteQuiz);


module.exports = router;