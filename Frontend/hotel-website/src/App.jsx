import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">🏨 Hotel Booking App</h1>
        <p className="text-gray-600 mb-6">Plan your perfect stay. Sign up or log in to continue.</p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/signup"
            className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition duration-200 shadow"
          >
            Sign Up
          </Link>
          <Link
            to="/login"
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition duration-200 shadow"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default App;