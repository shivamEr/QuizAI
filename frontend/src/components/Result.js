import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getResultById, handleApiError } from "../services/api";

const Result = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await getResultById(id);
        if (res.data) {
          setResult(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch result", err);
        handleApiError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center p-8">
        <div className="spinner mb-4"></div>
        <p className="text-text-secondary">Calculating your score...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="content-card text-center max-w-lg mx-auto">
        <div className="text-5xl mb-4">❌</div>
        <p className="text-xl text-text-secondary">Result not found.</p>
      </div>
    );
  }

  // Calculate wrong answers
  const wrongAnswers = result.totalQuestions - result.correctAnswers;

  return (
    <div className="container mx-auto p-6">
      <div className="content-card max-w-lg mx-auto text-center">
        <h1 className="text-3xl font-bold text-text mb-2">🎉 Quiz Completed!</h1>
        <p className="text-text-secondary mb-6">Here's your score for the "{result.quiz?.title}" quiz.</p>

        <div className="my-8">
          <span className="text-7xl font-bold text-primary">{result.score}</span>
          <span className="text-4xl text-primary font-semibold">%</span>
        </div>
        
        <div className="grid grid-cols-3 gap-4 bg-background p-4 rounded-lg border border-border">
          <div className="stat-item">
            <div className="text-2xl font-semibold text-success">{result.correctAnswers}</div>
            <div className="text-sm text-text-secondary">Correct</div>
          </div>
          <div className="stat-item">
            <div className="text-2xl font-semibold text-danger">{wrongAnswers}</div>
            <div className="text-sm text-text-secondary">Wrong</div>
          </div>
          <div className="stat-item">
            <div className="text-2xl font-semibold text-primary">{result.score}%</div>
            <div className="text-sm text-text-secondary">Percentage</div>
          </div>
        </div>

        <button
          className="btn bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 mt-8 w-full"
          onClick={() => navigate("/my-results")}
        >
          View All My Results
        </button>
      </div>
    </div>
  );
};

export default Result;