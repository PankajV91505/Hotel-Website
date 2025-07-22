import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import Login from './pages/auth/Login.jsx';
import Signup from './pages/auth/Signup.jsx';
import ForgotPassword from './pages/auth/ForgotPassword.jsx';
import ResetPassword from './pages/auth/ResetPassword.jsx';
import AddRoom from './pages/dashboard/AddRoom.jsx';
import EditRoom from './pages/dashboard/EditRoom.jsx';
import Callback from './pages/Callback.jsx';
import BookRoom from './pages/BookRoom.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ErrorBoundary from './ErrorBoundary.jsx';
import Profile from './pages/Profile.jsx';


import 'leaflet/dist/leaflet.css';
import './index.css';

function Root() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} errorElement={<ErrorBoundary />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard/rooms" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} errorElement={<ErrorBoundary />} />
          <Route path="/dashboard/add-room" element={<AddRoom />} />
          <Route path="/dashboard/edit-room/:id" element={<EditRoom />} />
          <Route path="/dashboard/book-room/:id" element={<BookRoom />} />
          <Route path="/book-room" element={<BookRoom />} />
          <Route path="/callback" element={<Callback />} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);
