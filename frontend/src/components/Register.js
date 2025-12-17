import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { registerUser, loginUser, handleApiError } from "../services/api";
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "student",
  });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(formData);
      const loginRes = await loginUser({ email: formData.email, password: formData.password });
      if (loginRes.data.token) {
        login(loginRes.data.token);
        toast.success('Registration successful!');
        navigate("/dashboard");
      }
    } catch (err) {
      handleApiError(err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-120px)]">
      <div className="content-card w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-text">Create Your Account</h2>
          <p className="text-text-secondary mt-2">Sign up to start creating and taking quizzes.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-text-secondary text-sm font-bold mb-2">Username</label>
            <input
              type="text"
              name="username"
              className="form-input w-full"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

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

          <div className="mb-4">
            <label className="block text-text-secondary text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              name="password"
              className="form-input w-full"
              value={formData.password}
              onChange={handleChange}
              minLength="8"
              // pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}"
              // title="Password must include at least 1 uppercase, 1 lowercase, 1 number, and 1 special character."
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-text-secondary text-sm font-bold mb-2">I am a...</label>
            <select
              name="role"
              className="form-select w-full"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-lg transition-all duration-300">
            Register
          </button>
        </form>

        <p className="text-center text-text-secondary mt-6">
          Already have an account? <Link to="/login" className="font-bold text-primary hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
