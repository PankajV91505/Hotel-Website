import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignupForm from '../../components/auth/SignupForm';
import { signup, verifyOtp } from '../../api/auth';

function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('signup');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const response = await signup({ firstName, lastName, email, password });
      console.log('Signup response:', response);
      setMessage('OTP sent to your email. Please verify.');
      setStep('verify');
    } catch (error) {
      console.error('Signup failed:', error);
      setError(error.response?.data?.message || 'Failed to sign up. Please try again.');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const response = await verifyOtp(email, otp);
      localStorage.setItem('token', response.access_token);
      setMessage('Email verified successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000); // Redirect to login after 2 seconds
    } catch (error) {
      console.error('OTP verification failed:', error);
      setError(error.response?.data?.message || 'Invalid OTP. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Hotel Booking App</h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {message && <p className="text-green-500 mb-4 text-center">{message}</p>}
        {step === 'signup' ? (
          <SignupForm
            firstName={firstName}
            setFirstName={setFirstName}
            lastName={lastName}
            setLastName={setLastName}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            handleSignup={handleSignup}
          />
        ) : (
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-2xl mb-4 text-center">Verify OTP</h2>
            <p className="text-gray-600 mb-4 text-center">An OTP has been sent to {email}</p>
            <form onSubmit={handleVerifyOtp}>
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
              <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                Verify OTP
              </button>
            </form>
            <p className="mt-4 text-center">
              <a href="/login" className="text-blue-500 hover:underline">Go to Login</a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Signup;