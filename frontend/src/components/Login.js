import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser, handleApiError } from "../services/api";
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await loginUser(formData);
      if (res.data.token) {
        login(res.data.token);
        toast.success('Login successful!');
        navigate("/dashboard");
      }
    } catch (err) {
      handleApiError(err);
    }
  };

  return (
    // This container centers the card on the page
    <div className="flex justify-center items-center min-h-[calc(100vh-120px)]">
      {/* Replaced .auth-card with the more versatile .content-card */}
      <div className="content-card w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-text">Welcome Back!</h2>
          <p className="text-text-secondary mt-2">Please login to continue to your dashboard.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-text-secondary text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              name="email"
              className="form-input w-full"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-text-secondary text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              name="password"
              className="form-input w-full"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-lg transition-all duration-300">
            Login
          </button>
        </form>

        <p className="text-center text-text-secondary mt-6">
          Don’t have an account? <Link to="/register" className="font-bold text-primary hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
