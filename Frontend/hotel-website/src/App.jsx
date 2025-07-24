import { useState } from 'react';
import { Outlet } from 'react-router-dom'; // Outlet is used for nested routes
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar'; // Adjust path if needed
import Sidebar from './components/Sidebar'; // Adjust path if needed
import Footer from './components/Footer'; // Adjust path if needed

function App({ isAuthenticated, setIsAuthenticated }) { // Receive props from Root
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        toggleSidebar={toggleSidebar}
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />

      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      <main
        className={`flex-grow transition-all duration-300 ease-in-out
          ${isSidebarOpen ? 'md:ml-64' : 'md:ml-0'}`}
      >
        {/* This Outlet will render the content of your nested routes (e.g., Home, Login, Dashboard) */}
        <Outlet />
      </main>
      <Footer />
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
}

export default App;
