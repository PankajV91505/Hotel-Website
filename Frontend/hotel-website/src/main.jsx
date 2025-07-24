import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx"; // Now App will act as the layout
import Login from "./pages/auth/Login.jsx";
import Signup from "./pages/auth/Signup.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";
import AddRoom from "./pages/dashboard/AddRoom.jsx";
import EditRoom from "./pages/dashboard/EditRoom.jsx";
import Callback from "./pages/Callback.jsx";
import BookRoom from "./pages/BookRoom.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ErrorBoundary from "./ErrorBoundary.jsx";
import Profile from "./pages/Profile.jsx";
import MyBookings from "./pages/dashboard/MyBookings.jsx";
import Home from "./pages/Home.jsx";

import "leaflet/dist/leaflet.css";
import "./index.css";

function Root() {
  // You might want to manage isAuthenticated state at a higher level,
  // perhaps using React Context API for better state management across the app.
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          {/* App now acts as a layout component */}
          <Route
            path="/"
            element={
              <App
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
              />
            }
            errorElement={<ErrorBoundary />}
          >
            {/* Changed from index to path="home" */}
            <Route path="" element={<Home />} />
            {/* Default content for '/' */}
            <Route
              path="login"
              element={<Login setIsAuthenticated={setIsAuthenticated} />}
            />
            <Route path="signup" element={<Signup />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
            <Route path="dashboard/rooms" element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="dashboard/add-room" element={<AddRoom />} />
            <Route path="dashboard/edit-room/:id" element={<EditRoom />} />
            <Route path="dashboard/book-room/:id" element={<BookRoom />} />
            <Route path="book-room" element={<BookRoom />} />{" "}
            {/* This seems like a duplicate, consider consolidating */}
            <Route path="callback" element={<Callback />} />
            <Route path="dashboard/bookings" element={<MyBookings />} />
            <Route path="home" element={<Home />} />
            {/* Add other routes here that should appear within the layout */}
            {/* Example: <Route path="contact" element={<ContactPage />} /> */}
            {/* Example: <Route path="privacy" element={<PrivacyPolicyPage />} /> */}
          </Route>
          {/* Routes that should NOT have Navbar/Sidebar/Footer (e.g., full-screen login/signup if desired) */}
          {/* <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} /> */}
          {/* <Route path="/signup" element={<Signup />} /> */}
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Root />);
