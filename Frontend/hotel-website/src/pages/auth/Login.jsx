import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, forgotPassword } from '../../api/auth';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const response = await login(email, password);
      localStorage.setItem('token', response.access_token);
      navigate('/dashboard/rooms');
    } catch (error) {
      console.error('Login failed:', error);
      setError(error.response?.data?.message || 'Failed to log in. Please try again.');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await forgotPassword(forgotPasswordEmail);
      setMessage('OTP sent to your email. Check your inbox.');
    } catch (error) {
      console.error('Forgot password failed:', error);
      setError(error.response?.data?.message || 'Failed to send OTP. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Hotel Booking App</h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {message && <p className="text-green-500 mb-4 text-center">{message}</p>}
        {!showForgotPassword ? (
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-2xl mb-4 text-center">Login</h2>
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
              <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                Login
              </button>
            </form>
            <p className="mt-4 text-center">
              <button
                onClick={() => setShowForgotPassword(true)}
                className="text-blue-500 hover:underline"
              >
                Forgot Password?
              </button>
            </p>
            <p className="mt-2 text-center">
              Don't have an account?{' '}
              <a href="/signup" className="text-blue-500 hover:underline">
                Sign Up
              </a>
            </p>
          </div>
        ) : (
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-2xl mb-4 text-center">Forgot Password</h2>
            <form onSubmit={handleForgotPassword}>
              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                Send OTP
              </button>
            </form>
            <p className="mt-4 text-center">
              <button
                onClick={() => setShowForgotPassword(false)}
                className="text-blue-500 hover:underline"
              >
                Back to Login
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;