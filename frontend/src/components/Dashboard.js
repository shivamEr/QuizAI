import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { getQuizzes, deleteQuiz, handleApiError } from "../services/api";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await getQuizzes();
        if (res.data) setQuizzes(res.data);
      } catch (err) {
        handleApiError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  const handleDelete = async (quizId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this quiz? All student results will be removed."
      )
    ) {
      try {
        await deleteQuiz(quizId);
        setQuizzes(quizzes.filter((q) => q._id !== quizId));
        toast.success("Quiz deleted successfully");
      } catch (err) {
        handleApiError(err);
      }
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Header */}
      <div className="mb-10 rounded-2xl border border-border bg-card p-8 shadow-sm">
        <h1 className="text-4xl font-extrabold text-text mb-2">
          Welcome, {user?.username} 👋
        </h1>
        <p className="text-lg text-text-secondary">
          {user?.role === "teacher"
            ? "Manage quizzes, analyze performance, and improve learning outcomes."
            : "Select a quiz below and test your knowledge."}
        </p>

        <div className="mt-6 flex flex-wrap gap-4">
          {user?.role === "teacher" && (
            <Link
              to="/create-quiz"
              className="rounded-xl bg-primary px-6 py-3 font-semibold text-white shadow hover:bg-primary-dark transition"
            >
              ➕ Create New Quiz
            </Link>
          )}
          {user?.role === "student" && (
            <Link
              to="/my-results"
              className="rounded-xl border border-border bg-card px-6 py-3 font-semibold text-text hover:bg-border transition"
            >
              📊 My Results
            </Link>
          )}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-20 text-text-secondary">
          Loading quizzes…
        </div>
      )}

      {/* Empty State */}
      {!loading && quizzes.length === 0 && (
        <div className="rounded-2xl border border-border bg-card p-12 text-center shadow-sm">
          <div className="mb-4 text-5xl">📭</div>
          <p className="text-xl text-text-secondary">
            {user?.role === "teacher"
              ? "You haven’t created any quizzes yet."
              : "No quizzes are available right now."}
          </p>

          {user?.role === "teacher" && (
            <Link
              to="/create-quiz"
              className="mt-6 inline-block rounded-xl bg-primary px-8 py-3 font-semibold text-white shadow hover:bg-primary-dark transition"
            >
              Create Your First Quiz
            </Link>
          )}
        </div>
      )}

      {/* Quiz Grid */}
      {!loading && quizzes.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz, index) => (
            <motion.div
              key={quiz._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="flex"
            >
              <div className="flex w-full flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-lg transition">
                {/* Quiz Info */}
                <div>
                  <h3 className="mb-2 text-xl font-bold text-text">
                    {quiz.title}
                  </h3>
                  <p className="mb-4 text-sm text-text-secondary line-clamp-3">
                    {quiz.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-text-secondary">
                    <span>
                      By{" "}
                      <span className="font-semibold text-text">
                        {quiz.createdBy?.username || "Unknown"}
                      </span>
                    </span>
                    <span className="rounded-full border border-border px-3 py-1">
                      {quiz.questions?.length || 0} Questions
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex flex-wrap gap-2">
                  {user?.role === "student" && (
                    <Link
                      to={`/quiz/${quiz._id}`}
                      className="w-full rounded-xl bg-primary px-4 py-2 text-center font-semibold text-white shadow hover:bg-primary-dark transition"
                    >
                      Take Quiz
                    </Link>
                  )}

                  {user?.role === "teacher" && (
                    <>
                      <Link
                        to={`/quiz/${quiz._id}/analytics`}
                        className="flex-1 rounded-xl border border-primary px-4 py-2 text-center font-semibold text-primary hover:bg-primary hover:text-white transition"
                      >
                        Analytics
                      </Link>
                      <button
                        onClick={() => handleDelete(quiz._id)}
                        className="flex-1 rounded-xl bg-danger px-4 py-2 font-semibold text-white hover:opacity-90 transition"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
