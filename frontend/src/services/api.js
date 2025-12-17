// frontend/src/services/api.js
import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const loginUser = (userData) => api.post('/auth/login', userData);
export const registerUser = (userData) => api.post('/auth/register', userData);

export const getQuizzes = () => api.get('/quizzes');
export const getQuizById = (quizId) => api.get(`/quizzes/${quizId}`);
export const createQuiz = (quizData) => api.post('/quizzes', quizData);
export const deleteQuiz = (quizId) => api.delete(`/quizzes/${quizId}`); // <-- Add this line
export const generateQuizWithAI = (request) => api.post('/quizzes/generate-questions', { request });
//export const generateQuizWithAI = (topic) => api.post('/quizzes/generate-questions', { topic });
// NEW FUNCTION FOR ANALYTICS
export const getQuizAnalytics = (quizId) => api.get(`/quizzes/${quizId}/analytics`);

export const submitQuiz = (resultData) => api.post('/results', resultData);
export const getMyResults = () => api.get('/results');
export const getResultById = (resultId) => api.get(`/results/${resultId}`);

export const handleApiError = (error) => {
    const message = error.response?.data?.message || error.message || "An unexpected error occurred.";
    toast.error(message);
    console.error("API Error:", error);
};

export default api;