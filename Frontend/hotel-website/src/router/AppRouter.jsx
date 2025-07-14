import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/auth/Login';
import Signup from '../pages/auth/Signup';
import VerifyOtp from '../pages/auth/VerifyOtp';
import ForgotPassword from '../pages/auth/ForgotPassword';
import Rooms from '../pages/dashboard/Rooms';
import AddRoom from '../pages/dashboard/AddRoom';
import EditRoom from '../pages/dashboard/EditRoom';
import MyBookings from '../pages/bookings/MyBookings';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import { useAuth } from '../hooks/useAuth';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function AppRouter() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>
      
      {/* Protected Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route
          path="/dashboard/rooms"
          element={<ProtectedRoute><Rooms /></ProtectedRoute>}
        />
        <Route
          path="/dashboard/add-room"
          element={<ProtectedRoute><AddRoom /></ProtectedRoute>}
        />
        <Route
          path="/dashboard/edit-room/:id"
          element={<ProtectedRoute><EditRoom /></ProtectedRoute>}
        />
        <Route
          path="/bookings/my-bookings"
          element={<ProtectedRoute><MyBookings /></ProtectedRoute>}
        />
      </Route>

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default AppRouter;