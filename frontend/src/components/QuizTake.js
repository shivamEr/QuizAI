import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getQuizById, submitQuiz, handleApiError } from "../services/api";
import toast from "react-hot-toast";

export default function QuizTake() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await getQuizById(id);
        setQuiz(res.data);
      } catch (err) {
        handleApiError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  const handleOptionChange = (questionId, optionIndex) => {
    setAnswers({ ...answers, [questionId]: optionIndex });
  };

  const goToNextQuestion = () => {
    if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (quiz && Object.keys(answers).length !== quiz.questions.length) {
      return toast.error("Please answer all questions before submitting.");
    }

    setSubmitting(true);
    try {
      const payload = {
        quizId: quiz._id,
        answers: Object.entries(answers).map(([questionId, selectedOptionIndex]) => ({
          questionId,
          selectedOptions: [selectedOptionIndex],
        })),
      };

      const res = await submitQuiz(payload);
      toast.success("Quiz submitted successfully!");

      navigate(res.data.resultId ? `/result/${res.data.resultId}` : "/my-results");
    } catch (err) {
      handleApiError(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20 text-text-secondary">Loading quiz…</div>;
  }

  if (!quiz) {
    return <div className="flex justify-center py-20 text-text-secondary">Quiz not found.</div>;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;
  const progress = Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-text">{quiz.title}</h1>
        <p className="mt-2 text-lg text-text-secondary">{quiz.description}</p>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="mb-2 flex justify-between text-sm text-text-secondary">
          <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
          <span>{progress}% completed</span>
        </div>
        <div className="h-2 w-full rounded-full bg-border">
          <div
            className="h-2 rounded-full bg-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
        <h2 className="mb-8 text-xl font-semibold text-text whitespace-pre-wrap break-words">
          {currentQuestion.text}
        </h2>

        <div className="space-y-4">
          {currentQuestion.options.map((opt, idx) => {
            const checked = answers[currentQuestion._id] === idx;
            return (
              <label
                key={idx}
                className={`flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition
                  ${checked ? "border-primary bg-primary/10" : "border-border hover:bg-border"}`}
              >
                <input
                  type="radio"
                  name={`q-${currentQuestion._id}`}
                  checked={checked}
                  onChange={() => handleOptionChange(currentQuestion._id, idx)}
                  disabled={submitting}
                  className="mt-1 h-5 w-5 text-primary focus:ring-primary"
                />
                <span className="text-lg text-text whitespace-pre-wrap break-words">{opt.text}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={goToPrevQuestion}
          disabled={currentQuestionIndex === 0}
          className="rounded-xl border border-border bg-card px-6 py-2 font-medium text-text hover:bg-border disabled:opacity-40"
        >
          Previous
        </button>

        {currentQuestionIndex === totalQuestions - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="rounded-xl bg-primary px-10 py-3 font-semibold text-white shadow hover:opacity-90 disabled:opacity-60"
          >
            {submitting ? "Submitting…" : "Submit Quiz"}
          </button>
        ) : (
          <button
            onClick={goToNextQuestion}
            className="rounded-xl bg-primary px-10 py-3 font-semibold text-white shadow hover:bg-primary-dark"
          >
            Next Question
          </button>
        )}
      </div>
    </div>
  );
}
