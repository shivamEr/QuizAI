// backend/controllers/resultController.js
const Quiz = require("../models/Quiz");
const Result = require("../models/Result");

// @desc    Submit a completed quiz
// @route   POST /api/results
// @access  Private
const submitQuiz = async (req, res) => {
  try {
    const { quizId, answers: submittedAnswers } = req.body;
    const userId = req.user.id;

    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    let correctAnswersCount = 0;
    const totalQuestions = quiz.questions.length;
    const detailedAnswers = []; // Array to hold the detailed answer breakdown

    quiz.questions.forEach((question) => {
      const submittedAnswer = submittedAnswers.find(
        (ans) => ans.questionId === question._id.toString()
      );

      let isAnswerCorrect = false;
      const selectedOptionIndex = submittedAnswer ? submittedAnswer.selectedOptions[0] : -1;

      if (submittedAnswer) {
        const correctOptionIndex = question.options.findIndex((opt) => opt.isCorrect);

        if (selectedOptionIndex === correctOptionIndex) {
          correctAnswersCount++;
          isAnswerCorrect = true;
        }
      }
      
      // Add the detailed answer object to our array
      detailedAnswers.push({
        questionText: question.text,
        selectedOptionIndex: selectedOptionIndex,
        isCorrect: isAnswerCorrect,
      });
    });

    const score = (correctAnswersCount / totalQuestions) * 100;

    const result = await Result.create({
      user: userId,
      quiz: quizId,
      score: score.toFixed(2),
      correctAnswers: correctAnswersCount,
      totalQuestions,
      answers: detailedAnswers, // Save the new detailed answers array
    });

    res.status(201).json({
      message: "Quiz submitted successfully!",
      resultId: result._id,
      score: result.score,
      correctAnswers: result.correctAnswers,
      totalQuestions: result.totalQuestions,
    });
  } catch (error) {
    console.error("Error submitting quiz:", error.message);
    res.status(500).json({ message: "Server error while submitting quiz." });
  }
};

// @desc    Get all results for a user
// @route   GET /api/results
// @access  Private
const getMyResults = async (req, res) => {
  try {
    const results = await Result.find({ user: req.user.id })
      .sort({ attemptedAt: -1 })
      .populate("quiz", "title description");

    if (!results) {
        return res.status(404).json({ message: "No results found for this user." });
    }

    res.json(results);
  } catch (error) {
    console.error("Error fetching results:", error.message);
    res.status(500).json({ message: "Server error while fetching results." });
  }
};

// @desc    Get a single result by its ID
// @route   GET /api/results/:id
// @access  Private
const getResultById = async (req, res) => {
    try {
        const result = await Result.findById(req.params.id)
            .populate('quiz', 'title');

        if (!result) {
            return res.status(404).json({ message: 'Result not found' });
        }

        if (result.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'User not authorized to view this result' });
        }

        res.json(result);

    } catch (error) {
        console.error("Error fetching result by ID:", error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
  submitQuiz,
  getMyResults,
  getResultById,
};