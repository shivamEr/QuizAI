// backend/models/Quiz.js
const mongoose = require("mongoose");

// Define the schema for an option within a question
const optionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  isCorrect: {
    type: Boolean,
    required: true,
    default: false,
  },
});

// Define the schema for a question within a quiz
const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  options: [optionSchema], // Embed the options schema
});

// Define the main quiz schema
const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Quiz title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    questions: [questionSchema], // Embed the questions schema
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quiz", quizSchema);