import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword } from "../../api/auth";
import { toast } from "react-toastify";
import { FaEnvelope } from 'react-icons/fa'; // Importing icon

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Added loading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true); // Set loading to true

    try {
      const response = await forgotPassword(email);
      toast.success(response.message); // Using toast for success message
      setTimeout(() => navigate("/reset-password"), 1500); // Shorter timeout for faster redirection
    } catch (err) {
      console.error("Forgot password failed:", err);
      const errorMessage = err.response?.data?.message || "Failed to send OTP. Please try again.";
      setError(errorMessage); // Set error for display in component
      toast.error(errorMessage); // Show toast notification
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4 font-inter">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 sm:p-10 transform transition-all duration-300 hover:scale-[1.01]">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
          Forgot Password?
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
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

          <button
            type="submit"
            disabled={loading} // Disable button when loading
            className="w-full bg-indigo-600 text-white p-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300 shadow-md transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Remember your password?{" "}
          <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-semibold hover:underline transition duration-200">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
