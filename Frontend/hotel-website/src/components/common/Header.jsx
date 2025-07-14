import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-blue-500 text-white p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Hotel Booking</Link>
        <div>
          <Link to="/dashboard/rooms" className="mr-4">Rooms</Link>
          <Link to="/bookings/my-bookings" className="mr-4">My Bookings</Link>
          {user ? (
            <button onClick={logout} className="bg-red-500 px-4 py-2 rounded">Logout</button>
          ) : (
            <>
              <Link to="/login" className="mr-4">Login</Link>
              <Link to="/signup">Sign Up</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;