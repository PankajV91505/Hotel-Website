import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, googleLogin } from "../../api/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await login({ email, password });
      localStorage.setItem("token", response.access_token);
      setMessage("Login successful! Redirecting to dashboard...");
      setTimeout(() => navigate("/dashboard/rooms"), 2000);
    } catch (error) {
      console.error("Login failed:", error);
      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    googleLogin(); // it redirects automatically
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Login</h1>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {message && <p className="text-green-500 mb-4 text-center">{message}</p>}

        <div className="bg-white p-6 rounded shadow-md">
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <button
            onClick={handleGoogleLogin}
            className="w-full bg-red-500 text-white p-2 rounded mt-4 hover:bg-red-600"
          >
            Login with Google
          </button>

          <p className="mt-4 text-center">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Sign Up
            </Link>
          </p>

          <p className="mt-2 text-center">
            Forgot your password?{" "}
            <Link to="/forgot-password" className="text-blue-500 hover:underline">
              Reset Password
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
