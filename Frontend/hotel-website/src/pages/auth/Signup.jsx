import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup, verifyOtp, googleLogin } from "../../api/auth";

function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await signup({ firstName, lastName, email, password });
      setMessage("OTP sent to your email");
      setShowOtp(true);
    } catch (error) {
      console.error("Signup failed:", error);
      const errorMessage = error.response?.data?.message || "Signup failed. Please try again.";
      setError(errorMessage);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const response = await verifyOtp(email, otp);
      localStorage.setItem("token", response.access_token);
      setMessage("Signup successful! Redirecting to dashboard...");
      setTimeout(() => navigate("/dashboard/rooms"), 2000);
    } catch (error) {
      console.error("OTP verification failed:", error);
      const errorMessage = error.response?.data?.message || "Invalid OTP. Please try again.";
      setError(errorMessage);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await googleLogin();
    } catch (error) {
      console.error("Google signup failed:", error);
      setError("Google signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">
          {showOtp ? "Verify OTP" : "Sign Up"}
        </h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {message && <p className="text-green-500 mb-4 text-center">{message}</p>}

        <div className="bg-white p-6 rounded shadow-md">
          {!showOtp ? (
            <>
              <form onSubmit={handleSignup}>
                <div className="mb-4">
                  <label className="block text-gray-700">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value.trim())}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value.trim())}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value.trim())}
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

                <div className="mb-4">
                  <label className="block text-gray-700">Re-enter Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                  Sign Up
                </button>
              </form>

              <button
                onClick={handleGoogleSignup}
                className="w-full bg-red-500 text-white p-2 rounded mt-4 hover:bg-red-600"
              >
                Sign up with Google
              </button>

              <p className="mt-4 text-center">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-500 hover:underline">
                  Login
                </Link>
              </p>
            </>
          ) : (
            <form onSubmit={handleVerifyOtp}>
              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  value={email}
                  className="w-full p-2 border rounded bg-gray-100"
                  disabled
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.trim())}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Verify OTP
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Signup;