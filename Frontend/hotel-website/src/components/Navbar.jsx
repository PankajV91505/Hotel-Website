import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserDetails, logout } from '../api/auth';
import { toast } from 'react-toastify';

function Navbar({ toggleSidebar, isAuthenticated, setIsAuthenticated }) {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
    fetchUser();
  }, [isAuthenticated, setIsAuthenticated, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setUser(null);
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/dashboard/rooms?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white p-4 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-extrabold tracking-wide">
          🏨 Hotel Booking
        </Link>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden focus:outline-none"
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
        >
          <svg className="w-6 h-6" fill="none" stroke="white" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="hover:text-gray-100 transition">Home</Link>
          <Link to="/dashboard/rooms" className="hover:text-gray-100 transition">Rooms</Link>
          <Link to="/dashboard/bookings" className="hover:text-gray-100 transition">My Bookings</Link>
          {user?.is_admin && (
            <Link to="/dashboard/add-room" className="hover:text-gray-100 transition">Add Room</Link>
          )}
          <Link to="/profile" className="hover:text-gray-100 transition">Profile</Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex items-center bg-white rounded overflow-hidden">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search rooms..."
              className="p-2 text-black focus:outline-none"
            />
            <button type="submit" className="bg-indigo-600 px-3 py-2 hover:bg-indigo-700 text-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>

          {/* User Dropdown */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 hover:text-gray-100"
              >
                <span>{user?.first_name || (user?.is_google_user ? 'Google User' : 'User')}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  {!user?.is_google_user && (
                    <Link
                      to="/reset-password"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Change Password
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex space-x-4">
              <Link to="/login" className="hover:text-gray-100">Login</Link>
              <Link to="/signup" className="hover:text-gray-100">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
