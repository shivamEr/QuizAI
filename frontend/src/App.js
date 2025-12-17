import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Components
import Navigation from './components/Navigation';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import CreateQuiz from './components/CreateQuiz';
import QuizTake from './components/QuizTake';
import MyResults from './components/MyResults';
import Result from './components/Result';
import QuizAnalytics from './components/QuizAnalytics';
import LandingPage from './components/LandingPage'; // Import the new LandingPage

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-center" reverseOrder={false} />
        <div className="App">
          <Navigation />
          <main> {/* Removed container class to allow landing page full width */}
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
              
              {/* The new landing page is now the default public route */}
              <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />

              {/* Private Routes */}
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/quiz/:id" element={<PrivateRoute><QuizTake /></PrivateRoute>} />
              <Route path="/my-results" element={<PrivateRoute><MyResults /></PrivateRoute>} />
              <Route path="/result/:id" element={<PrivateRoute><Result /></PrivateRoute>} />

              {/* Teacher Only Routes */}
              <Route path="/create-quiz" element={<PrivateRoute authorize="teacher"><CreateQuiz /></PrivateRoute>} />
              <Route path="/quiz/:id/analytics" element={<PrivateRoute authorize="teacher"><QuizAnalytics /></PrivateRoute>} />

              {/* Wildcard redirect */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

// Updated Route Guards
function PrivateRoute({ children, authorize }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>; // Or a loading spinner component

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (authorize && user.role !== authorize) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;

  return !user ? children : <Navigate to="/dashboard" />;
}

export default App;

