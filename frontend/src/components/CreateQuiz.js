import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createQuiz, generateQuizWithAI, handleApiError } from "../services/api";
import toast from 'react-hot-toast';
import QuestionItem from './QuestionItem'; // Import the new component

const CreateQuiz = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiRequest, setAiRequest] = useState(""); 

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { text: "", options: ["", "", "", ""], correctAnswerIndex: 0 },
    ]);
  };

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const updateOption = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };
  
  const handleGenerateAI = async () => {
    if (!aiRequest.trim()) return toast.error("Please enter a prompt for the AI.");
    setLoading(true);
    try {
      const res = await generateQuizWithAI(aiRequest);
      const formattedForState = res.data.questions.map(q => ({
        text: q.text,
        options: q.options.map(opt => opt.text),
        correctAnswerIndex: q.options.findIndex(opt => opt.isCorrect)
      }));
      setQuestions(formattedForState);
      toast.success("Questions generated successfully!");
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveQuiz = async () => {
    if (!title.trim() || questions.length === 0) {
      return toast.error("Please provide a title and at least one question.");
    }
    const quizPayload = {
      title,
      description,
      questions: questions.map(q => ({
        text: q.text,
        options: q.options.map((optText, index) => ({
          text: optText,
          isCorrect: index === q.correctAnswerIndex,
        })),
      })),
    };
    setLoading(true);
    try {
      await createQuiz(quizPayload);
      toast.success("✅ Quiz created successfully!");
      navigate("/dashboard");
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Create a New Quiz</h1>

        <div className="content-card">
          <h2 className="text-2xl font-semibold text-dark mb-6 border-b pb-4">1. Quiz Details</h2>
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Quiz Title</label>
            <input
              type="text"
              id="title"
              className="form-input focus:ring-2 focus:ring-primary w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Introduction to React"
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description</label>
            <textarea
              id="description"
              rows="3"
              className="form-input focus:ring-2 focus:ring-primary w-full"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A brief description of your quiz"
              disabled={loading}
            ></textarea>
          </div>
        </div>

        <div className="content-card">
          <h2 className="text-2xl font-semibold text-dark mb-6 border-b pb-4">2. Generate with AI (Optional)</h2>
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <textarea
              rows="3"
              className="form-input focus:ring-2 focus:ring-primary w-full"
              value={aiRequest}
              onChange={(e) => setAiRequest(e.target.value)}
              placeholder="Describe the quiz you want, e.g., 'Create 5 easy multiple-choice questions about the Roman Empire'."
              disabled={loading}
            />
            <button
              onClick={handleGenerateAI}
              className="btn bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300 w-full sm:w-auto"
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </div>

        <div className="content-card">
           <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="text-2xl font-semibold text-dark">3. Questions</h2>
              <button
                onClick={addQuestion}
                className="btn bg-secondary hover:bg-secondary/90 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
                disabled={loading}
              >
                ➕ Add Question
              </button>
            </div>
          
          {questions.length === 0 && (
            <p className="text-center text-gray-500 py-4">No questions added yet. Use the AI generator or add questions manually.</p>
          )}

          <div className="space-y-6">
            {questions.map((question, qIndex) => (
              <QuestionItem
                key={qIndex}
                qIndex={qIndex}
                question={question}
                updateQuestion={updateQuestion}
                updateOption={updateOption}
                removeQuestion={removeQuestion}
                loading={loading}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={handleSaveQuiz}
            className="btn bg-primary hover:bg-primary-dark text-white font-bold py-3 px-12 text-lg rounded-lg shadow-lg transition duration-300"
            disabled={loading || questions.length === 0}
          >
            {loading ? 'Saving...' : 'Save Quiz'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateQuiz;