import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import Signup from './pages/auth/Signup.jsx';
import Login from './pages/auth/Login.jsx';
import ResetPassword from './pages/auth/ResetPassword.jsx';
import Rooms from './pages/dashboard/Rooms.jsx';
import AddRoom from './pages/dashboard/AddRoom.jsx';
import EditRoom from './pages/dashboard/EditRoom.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard">
          <Route path="rooms" element={<Rooms />} />
          <Route path="add-room" element={<AddRoom />} />
          <Route path="edit-room/:id" element={<EditRoom />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);