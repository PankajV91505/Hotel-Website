import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import App from './App.jsx';
// import Signup from './pages/auth/Signup.jsx';
// import Login from './pages/auth/Login.jsx';
// import VerifyOtp from './pages/auth/VerifyOtp.jsx';
// import ResetPassword from './pages/auth/ResetPassword.jsx';
// import './index.css';

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<App />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/VerifyOtp" element={<VerifyOtp />} />
//         <Route path="/reset-password" element={<ResetPassword />} />
//         <Route path="/dashboard/*" element={<div>Dashboard Placeholder</div>} />
//       </Routes>
//     </BrowserRouter>
//   </React.StrictMode>
// );