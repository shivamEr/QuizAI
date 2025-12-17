import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyResults, handleApiError } from "../services/api";

const MyResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await getMyResults();
        if (res.data) {
          setResults(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch results", err);
        handleApiError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-text">My Quiz Results</h1>
        <p className="text-lg text-text-secondary mt-2">A history of all the quizzes you've completed.</p>
      </div>

      {loading ? (
        <div className="text-center p-8">
          <div className="spinner mb-4"></div>
          <p className="text-text-secondary">Loading your results...</p>
        </div>
      ) : results.length === 0 ? (
        <div className="content-card text-center max-w-lg mx-auto">
          <div className="text-5xl mb-4">😅</div>
          <p className="text-xl text-text-secondary">You haven’t taken any quizzes yet.</p>
          <Link to="/dashboard" className="btn bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300 mt-6 inline-block">
            Find a Quiz to Take
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((result) => (
            <div key={result._id} className="content-card flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-text mb-2">{result.quiz?.title || "Quiz Title Not Available"}</h3>
                <p className="text-text-secondary mb-4">
                  Score: <span className="font-bold text-2xl text-primary">{result.score}%</span>
                </p>
                <p className="text-sm text-text-secondary">
                  ({result.correctAnswers} / {result.totalQuestions} correct)
                </p>
              </div>
              <div className="text-xs text-text-secondary mt-4 pt-4 border-t border-border">
                Taken on:{" "}
                {new Date(result.attemptedAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyResults;