import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyOtp } from '../../api/auth';
import { useAuth } from '../../hooks/useAuth';

function VerifyOtp() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await verifyOtp({
        email: email,
        otp: otp // ✅ snake_case
      });
      login(response.access_token);
      navigate('/dashboard/rooms');
    } catch (error) {
      console.error('OTP verification failed:', error);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Verify OTP</h2>
        <form onSubmit={handleVerifyOtp}>
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
            <label className="block text-gray-700">OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
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
      </div>
    </div>
  );
}

export default VerifyOtp;
