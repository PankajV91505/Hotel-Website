import React from 'react';
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
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} errorElement={<ErrorBoundary />} />
        <Route path="/login" element={<Login />} errorElement={<ErrorBoundary />} />
        <Route path="/signup" element={<Signup />} errorElement={<ErrorBoundary />} />
        <Route path="/forgot-password" element={<ForgotPassword />} errorElement={<ErrorBoundary />} />
        <Route path="/reset-password" element={<ResetPassword />} errorElement={<ErrorBoundary />} />
        <Route path="/dashboard/rooms" element={<Dashboard />} errorElement={<ErrorBoundary />} />
        <Route path="/dashboard/add-room" element={<AddRoom />} errorElement={<ErrorBoundary />} />
        <Route path="/dashboard/edit-room/:id" element={<EditRoom />} errorElement={<ErrorBoundary />} />
        <Route path="/dashboard/book-room/:id" element={<BookRoom />} errorElement={<ErrorBoundary />} />
        <Route path="/book-room" element={<BookRoom />} errorElement={<ErrorBoundary />} />
        <Route path="/callback" element={<Callback />} errorElement={<ErrorBoundary />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);