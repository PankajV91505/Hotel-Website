import { FaUser, FaBed, FaSignOutAlt, FaLock, FaPlus, FaHome } from "react-icons/fa";
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserDetails } from '../api/auth';
import { toast } from 'react-toastify';

function Sidebar({ isOpen, toggleSidebar, isAuthenticated, setIsAuthenticated }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      if (isAuthenticated) {
        try {
          const userData = await getUserDetails();
          setUser(userData);
        } catch (error) {
          console.error('Failed to fetch user details:', error);
          if (error.response?.status === 401) {
            toast.error('Session expired. Please log in again.');
            localStorage.removeItem('token');
            setIsAuthenticated(false);
            navigate('/login');
          } else {
            toast.error('Failed to fetch user details');
          }
        }
      }
    };
    if (isOpen && isAuthenticated) fetchUser();
  }, [isOpen, isAuthenticated, setIsAuthenticated, navigate]);

  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:fixed md:translate-x-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white shadow-lg`}
    >
      <div className="p-6">
        {/* User Info */}
        {user && (
          <div className="mb-6">
            <p className="text-xl font-bold">
              {user.first_name} {user.last_name} {user.is_google_user && '(Google)'}
            </p>
            <p className="text-sm text-gray-200">{user.email}</p>
          </div>
        )}

        {/* Close Button (Mobile) */}
        <button
          className="md:hidden mb-6 focus:outline-none"
          onClick={toggleSidebar}
          aria-label="Close Sidebar"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Sidebar Links */}
        <ul className="space-y-4 text-base font-medium">
          <li>
            <Link to="/" onClick={toggleSidebar} className="flex items-center gap-2 hover:text-white/90">
              <FaHome /> Home
            </Link>
          </li>
          <li>
            <Link to="/dashboard/rooms" onClick={toggleSidebar} className="flex items-center gap-2 hover:text-white/90">
              <FaBed /> Rooms
            </Link>
          </li>
          <li>
            <Link to="/dashboard/bookings" onClick={toggleSidebar} className="flex items-center gap-2 hover:text-white/90">
              <FaUser /> My Bookings
            </Link>
          </li>
          {user?.is_admin && (
            <>
              <li>
                <Link to="/dashboard/add-room" onClick={toggleSidebar} className="flex items-center gap-2 hover:text-white/90">
                  <FaPlus /> Add Room
                </Link>
              </li>
              <li>
                <Link to="/dashboard/rooms" onClick={toggleSidebar} className="flex items-center gap-2 hover:text-white/90">
                  <FaBed /> Manage Rooms
                </Link>
              </li>
            </>
          )}
          <li>
            <Link to="/profile" onClick={toggleSidebar} className="flex items-center gap-2 hover:text-white/90">
              <FaUser /> Profile
            </Link>
          </li>
          {!user?.is_google_user && (
            <li>
              <Link to="/reset-password" onClick={toggleSidebar} className="flex items-center gap-2 hover:text-white/90">
                <FaLock /> Change Password
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
