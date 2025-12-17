import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getQuizAnalytics, handleApiError, getQuizById } from "../services/api";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const QuizAnalytics = () => {
  const { id } = useParams();
  const [quizTitle, setQuizTitle] = useState("Loading...");
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const quizRes = await getQuizById(id);
        setQuizTitle(quizRes.data.title);

        const analyticsRes = await getQuizAnalytics(id);
        setAnalytics(analyticsRes.data);
      } catch (err) {
        handleApiError(err);
        setError("Failed to load quiz analytics.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-24 text-text-secondary">
        Loading analytics…
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-border bg-card p-10 text-center shadow-sm">
        <div className="mb-4 text-5xl">❌</div>
        <p className="text-lg text-text-secondary">{error}</p>
        <Link
          to="/dashboard"
          className="mt-6 inline-block rounded-xl bg-primary px-8 py-3 font-semibold text-white shadow hover:bg-primary-dark transition"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  if (!analytics || analytics.totalAttempts === 0) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h1 className="text-3xl font-bold text-text mb-2">{quizTitle}</h1>
        <p className="text-lg text-text-secondary mb-6">
          No student has attempted this quiz yet.
        </p>
        <Link
          to="/dashboard"
          className="rounded-xl bg-primary px-8 py-3 font-semibold text-white shadow hover:bg-primary-dark transition"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const chartData = {
    labels: analytics.studentResults.map(res => res.username),
    datasets: [
      {
        label: "Score (%)",
        data: analytics.studentResults.map(res => res.score),
        backgroundColor: "rgba(99, 102, 241, 0.6)",
        borderRadius: 8,
        barPercentage: 0.8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Student Scores (%)",
        font: { size: 18 },
        color: "#374151",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: { color: "#6B7280" },
      },
      x: {
        ticks: { color: "#6B7280" },
      },
    },
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Header */}
      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-4xl font-extrabold text-text">
          {quizTitle} Analytics
        </h1>
        <Link
          to="/dashboard"
          className="rounded-xl border border-border bg-card px-6 py-2 font-medium text-text hover:bg-border transition"
        >
          Back
        </Link>
      </div>

      {/* Overview + Chart */}
      <div className="grid gap-6 lg:grid-cols-3 mb-10">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <h2 className="mb-6 text-2xl font-semibold text-text">Overview</h2>

          <div className="space-y-6">
            <div>
              <p className="text-sm text-text-secondary">Total Attempts</p>
              <p className="text-3xl font-bold text-primary">
                {analytics.totalAttempts}
              </p>
            </div>
            <div>
              <p className="text-sm text-text-secondary">Average Score</p>
              <p className="text-3xl font-bold text-primary">
                {analytics.averageScore}%
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-sm h-96">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Top Incorrect Questions */}
      <div className="mb-10 rounded-2xl border border-border bg-card p-8 shadow-sm">
        <h2 className="mb-6 text-2xl font-semibold text-text">
          Most Incorrect Questions
        </h2>

        {analytics.topIncorrectQuestions.length > 0 ? (
          <ul className="space-y-4">
            {analytics.topIncorrectQuestions.map((q, idx) => (
              <li
                key={idx}
                className="rounded-xl border border-border bg-background p-4"
              >
                <p className="font-medium text-text">{q.questionText}</p>
                <p className="text-sm text-danger">
                  {q.incorrectCount} incorrect attempts
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-text-secondary">
            No incorrect answers recorded. Excellent performance 🎉
          </p>
        )}
      </div>

      {/* Student Attempts */}
      <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
        <h2 className="mb-6 text-2xl font-semibold text-text">
          Student Attempts
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-background">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">
                  Score (%)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">
                  Attempted At
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {analytics.studentResults.map((res, idx) => (
                <tr key={idx}>
                  <td className="px-6 py-4 text-sm font-medium text-text">
                    {res.username}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary">
                    {res.score}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary">
                    {new Date(res.attemptedAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default QuizAnalytics;
