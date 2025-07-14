import { useState } from 'react';
import { forgotPassword, resetPassword } from '../../api/auth';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState('request');

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      setStep('reset');
    } catch (error) {
      console.error('Failed to send OTP:', error);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await resetPassword(email, otp, newPassword);
      setStep('success');
    } catch (error) {
      console.error('Password reset failed:', error);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md">
      {step === 'request' && (
        <>
          <h2 className="text-2xl mb-4">Forgot Password</h2>
          <form onSubmit={handleRequestOtp}>
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
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
              Send OTP
            </button>
          </form>
        </>
      )}
      {step === 'reset' && (
        <>
          <h2 className="text-2xl mb-4">Reset Password</h2>
          <form onSubmit={handleResetPassword}>
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
            <div className="mb-4">
              <label className="block text-gray-700">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
              Reset Password
            </button>
          </form>
        </>
      )}
      {step === 'success' && (
        <div>
          <h2 className="text-2xl mb-4">Password Reset Successful</h2>
          <p>You can now <a href="/login" className="text-blue-500">log in</a> with your new password.</p>
        </div>
      )}
    </div>
  );
}

export default ForgotPassword;