import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';


const Icon = ({ d }) => (
  <svg
    className="w-10 h-10 text-primary"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} />
  </svg>
);

const LandingPage = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-purple-500/10 pointer-events-none" />

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 py-28 text-center">
        <motion.h1
          className="text-5xl md:text-7xl font-extrabold tracking-tight text-text mb-6"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          AI-Powered Quiz Management
          <span className="block text-primary">for Modern Education</span>
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto mb-12 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Create intelligent quizzes in seconds, manage classrooms effortlessly,
          and gain actionable insights into student performance — all in one platform.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row justify-center gap-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link
            to="/register"
            className="inline-flex items-center justify-center rounded-xl bg-primary px-10 py-4 text-lg font-semibold text-white shadow-lg hover:bg-primary-dark hover:shadow-xl transition"
          >
            Get Started Free
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-10 py-4 text-lg font-semibold text-text hover:bg-border transition"
          >
            Login
          </Link>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative max-w-7xl mx-auto px-6 pb-28">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Feature 1 */}
          <motion.div
            className="group rounded-2xl border border-border bg-card p-8 shadow-sm hover:shadow-xl transition"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition">
              <Icon d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </div>
            <h3 className="text-2xl font-bold text-text mb-3">AI Quiz Generation</h3>
            <p className="text-text-secondary leading-relaxed">
              Instantly generate high-quality quizzes from a simple prompt using advanced AI models.
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            className="group rounded-2xl border border-border bg-card p-8 shadow-sm hover:shadow-xl transition"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition">
              <Icon d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </div>
            <h3 className="text-2xl font-bold text-text mb-3">Smart Analytics</h3>
            <p className="text-text-secondary leading-relaxed">
              Track performance, spot learning gaps, and make data-driven decisions instantly.
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            className="group rounded-2xl border border-border bg-card p-8 shadow-sm hover:shadow-xl transition"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition">
              <Icon d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </div>
            <h3 className="text-2xl font-bold text-text mb-3">Role-Based Dashboards</h3>
            <p className="text-text-secondary leading-relaxed">
              Dedicated experiences for teachers and students with secure, role-based access.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;