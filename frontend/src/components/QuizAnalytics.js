import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getQuizAnalytics, handleApiError, getQuizById } from "../services/api";
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
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
  const [quizTitle, setQuizTitle] = useState("Loading Quiz...");
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
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

    fetchAnalytics();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center p-8">
        <div className="spinner mb-4"></div>
        <p className="text-text-secondary">Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content-card text-center max-w-lg mx-auto">
        <div className="text-5xl mb-4">❌</div>
        <p className="text-xl text-text-secondary">{error}</p>
        <Link to="/dashboard" className="btn bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300 mt-6 inline-block">
          Back to Dashboard
        </Link>
      </div>
    );
  }
  
  if (!analytics || analytics.totalAttempts === 0) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-3xl font-bold text-text mb-2">{quizTitle}</h1>
        <p className="text-xl text-text-secondary mb-6">No one has attempted this quiz yet.</p>
        <Link to="/dashboard" className="btn bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300 mt-4 inline-block">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  // Chart data configuration
  const chartData = {
    labels: ['Average Score'],
    datasets: [
      {
        label: 'Score',
        data: [analytics.averageScore],
        backgroundColor: 'rgba(122, 178, 211, 0.6)', // Using your primary color with transparency
        borderColor: 'rgba(122, 178, 211, 1)',
        borderWidth: 1,
        borderRadius: 5,
        barPercentage: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Average Quiz Score (%)',
        font: {
            size: 18,
            family: 'Inter',
        },
        color: '#4A628A' // Your primary text color
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: { color: '#6C757D' }, // Your secondary text color
      },
      x: {
        ticks: { color: '#6C757D' },
      }
    },
  };

  return (
    <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-text">{quizTitle} Analytics</h1>
            <Link to="/dashboard" className="btn bg-card hover:bg-border text-text border border-border">
                Back to Dashboard
            </Link>
        </div>

        {/* --- Overview & Chart --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-1 content-card">
                <h2 className="text-2xl font-semibold text-text mb-4">Overview</h2>
                <div className="space-y-4">
                    <div>
                        <p className="text-text-secondary">Total Attempts</p>
                        <p className="text-3xl font-bold text-primary">{analytics.totalAttempts}</p>
                    </div>
                    <div>
                        <p className="text-text-secondary">Average Score</p>
                        <p className="text-3xl font-bold text-primary">{analytics.averageScore}%</p>
                    </div>
                </div>
            </div>
            <div className="lg:col-span-2 content-card h-96 flex items-center justify-center">
                <Bar data={chartData} options={chartOptions} />
            </div>
        </div>

        {/* --- Top Incorrect Questions --- */}
        <div className="content-card mb-6">
            <h2 className="text-2xl font-semibold text-text mb-4">Top Incorrect Questions</h2>
            {analytics.topIncorrectQuestions.length > 0 ? (
                <ul className="space-y-3">
                {analytics.topIncorrectQuestions.map((item, index) => (
                    <li key={index} className="p-3 bg-background rounded-lg border border-border">
                    <p className="font-semibold text-text">{item.questionText}</p>
                    <p className="text-sm text-danger">{item.incorrectCount} incorrect answers</p>
                    </li>
                ))}
                </ul>
            ) : (
                <p className="text-text-secondary">No incorrect answers have been recorded yet. Great job!</p>
            )}
        </div>

        {/* --- Student Results Table --- */}
        <div className="content-card">
            <h2 className="text-2xl font-semibold text-text mb-4">All Student Attempts</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                    <thead className="bg-background">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Student</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Score (%)</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Attempted At</th>
                        </tr>
                    </thead>
                    <tbody className="bg-card divide-y divide-border">
                    {analytics.studentResults.map((result, index) => (
                        <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text">{result.username}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{result.score}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{new Date(result.attemptedAt).toLocaleString()}</td>
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
