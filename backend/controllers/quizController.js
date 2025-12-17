const Quiz = require("../models/Quiz");
const Result = require("../models/Result");
const { generateQuestions } = require("../services/aiService");

// ================================
// Create a new quiz
// ================================
exports.createQuiz = async (req, res) => {
  try {
    const { title, description, questions } = req.body;

    if (!title || !description || !questions || questions.length === 0) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const quiz = new Quiz({
      title,
      description,
      questions,
      createdBy: req.user.id,
    });

    await quiz.save();
    res.status(201).json(quiz);
  } catch (err) {
    console.error("Error creating quiz:", err);
    res.status(500).json({ message: "Server error while creating quiz" });
  }
};

// ================================
// Get all quizzes
// ================================
exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate("createdBy", "username");
    res.json(quizzes);
  } catch (err) {
    console.error("Error fetching quizzes:", err);
    res.status(500).json({ message: "Server error while fetching quizzes" });
  }
};

// ================================
// Get single quiz by ID
// ================================
exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.json(quiz);
  } catch (err) {
    console.error("Error fetching quiz:", err);
    res.status(500).json({ message: "Server error while fetching quiz" });
  }
};

// ================================
// AI-generated quiz questions
// ================================
exports.generateQuestionsWithAI = async (req, res) => {
  try {
    const { request: userRequest } = req.body;

    if (!userRequest) {
      return res.status(400).json({ message: "A prompt request is required" });
    }

    const aiQuestions = await generateQuestions(userRequest);
    
    const formattedQuestions = aiQuestions.map((q) => ({
      text: q.question,
      options: q.options.map((opt) => ({
        text: opt,
        isCorrect: opt === q.correctAnswer,
      })),
    }));

    res.json({ questions: formattedQuestions });
  } catch (err) {
    console.error("Error generating AI questions:", err);
    res.status(500).json({ message: "Server error while generating questions" });
  }
};

// ================================
// Delete a quiz
// ================================
exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Authorization Check: Make sure the user deleting the quiz is the one who created it
    if (quiz.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "User not authorized to delete this quiz" });
    }

    await Quiz.findByIdAndDelete(req.params.id);

    // Also delete all results associated with this quiz
    await Result.deleteMany({ quiz: req.params.id });

    res.json({ message: "Quiz and all associated results removed" });
  } catch (err) {
    console.error("Error deleting quiz:", err);
    res.status(500).json({ message: "Server error while deleting quiz" });
  }
};


// ============================================
// Get Analytics for a Single Quiz
// ============================================
exports.getQuizAnalytics = async (req, res) => {
    try {
        const { id: quizId } = req.params;

        const results = await Result.find({ quiz: quizId }).populate('user', 'username');

        if (results.length === 0) {
            return res.json({
                message: "No one has taken this quiz yet.",
                totalAttempts: 0,
                averageScore: 0,
                studentResults: [],
                topIncorrectQuestions: [],
            });
        }

        const totalAttempts = results.length;
        const totalScore = results.reduce((acc, result) => acc + result.score, 0);
        const averageScore = totalScore / totalAttempts;

        const studentResults = results.map(result => ({
            username: result.user.username,
            score: result.score,
            attemptedAt: result.attemptedAt
        }));

        const incorrectCounts = {};
        results.forEach(result => {
            result.answers.forEach(answer => {
                if (!answer.isCorrect) {
                    incorrectCounts[answer.questionText] = (incorrectCounts[answer.questionText] || 0) + 1;
                }
            });
        });

        const topIncorrectQuestions = Object.entries(incorrectCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5) // Get top 5
            .map(([questionText, incorrectCount]) => ({
                questionText,
                incorrectCount,
            }));
        
        res.json({
            totalAttempts,
            averageScore: averageScore.toFixed(2),
            studentResults,
            topIncorrectQuestions,
        });

    } catch (error) {
        console.error("Error fetching quiz analytics:", error);
        res.status(500).json({ message: "Server error while fetching analytics." });
    }
};