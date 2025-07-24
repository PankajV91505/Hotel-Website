import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white p-6 mt-auto shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left">
        {/* Copyright Information */}
        <div className="mb-4 md:mb-0">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Hotel Booking App. All rights reserved.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center md:justify-end space-x-4 text-sm">
          <Link to="/" className="hover:text-gray-300 transition-colors duration-200">
            Home
          </Link>
          <Link to="/dashboard/rooms" className="hover:text-gray-300 transition-colors duration-200">
            Rooms
          </Link>
          <Link to="/profile" className="hover:text-gray-300 transition-colors duration-200">
            Profile
          </Link>
          <Link to="/contact" className="hover:text-gray-300 transition-colors duration-200">
            Contact Us
          </Link>
          <Link to="/privacy" className="hover:text-gray-300 transition-colors duration-200">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
