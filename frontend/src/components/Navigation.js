import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navigation() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-tight text-text hover:text-primary transition"
        >
          GU<span className="text-primary">Quize</span>
        </Link>

        {/* Navigation Links */}
        <ul className="flex items-center gap-6">
          {!user && (
            <>
              <li>
                <Link
                  to="/login"
                  className="text-base font-medium text-text-secondary hover:text-text transition"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="rounded-xl bg-primary px-6 py-2.5 text-base font-semibold text-white shadow hover:bg-primary-dark transition"
                >
                  Get Started
                </Link>
              </li>
            </>
          )}

          {user && (
            <>
              <li>
                <Link
                  to="/dashboard"
                  className="text-base font-medium text-text-secondary hover:text-text transition"
                >
                  Dashboard
                </Link>
              </li>

              {user.role === "student" && (
                <li>
                  <Link
                    to="/my-results"
                    className="text-base font-medium text-text-secondary hover:text-text transition"
                  >
                    My Results
                  </Link>
                </li>
              )}

              {user.role === "teacher" && (
                <li>
                  <Link
                    to="/create-quiz"
                    className="text-base font-medium text-text-secondary hover:text-text transition"
                  >
                    Create Quiz
                  </Link>
                </li>
              )}

              <li>
                <button
                  onClick={logout}
                  className="rounded-xl border border-border px-5 py-2 text-base font-medium text-text hover:bg-border transition"
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Navigation;
