import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, googleLogin } from "../../api/auth";
import { toast } from 'react-toastify';
import { FaEnvelope, FaLock, FaGoogle } from 'react-icons/fa'; // Importing icons for a modern look

function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Removed 'message' state as toast handles messages

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await login({ email, password });
      localStorage.setItem("token", response.access_token);
      setIsAuthenticated(true);
      toast.success("Login successful! Redirecting...");
      setTimeout(() => navigate("/profile"), 1500); // Shorter timeout for faster redirection
    } catch (error) {
      console.error("Login failed:", error);
      const errorMessage =
        error.response?.data?.message || "Login failed. Please check your credentials.";
      setError(errorMessage); // Set error for display in component
      toast.error(errorMessage); // Show toast notification
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    googleLogin(); // This function should handle the redirection to Google OAuth
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4 font-inter">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 sm:p-10 transform transition-all duration-300 hover:scale-[1.01]">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
          Welcome Back!
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FaEnvelope className="text-gray-400" />
              </span>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FaLock className="text-gray-400" />
              </span>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white p-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300 shadow-md transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="relative flex py-5 items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-500">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center bg-red-600 text-white p-3 rounded-lg font-semibold hover:bg-red-700 transition duration-300 shadow-md transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          <FaGoogle className="mr-2" /> Login with Google
        </button>

        <p className="mt-6 text-center text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-indigo-600 hover:text-indigo-800 font-semibold hover:underline transition duration-200">
            Sign Up
          </Link>
        </p>

        <p className="mt-2 text-center text-gray-600">
          Forgot your password?{" "}
          <Link to="/forgot-password" className="text-indigo-600 hover:text-indigo-800 font-semibold hover:underline transition duration-200">
            Reset Password
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
