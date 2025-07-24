import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaHotel, FaStar, FaMapMarkerAlt } from 'react-icons/fa'; // Importing icons

function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to the rooms dashboard with the search query
      navigate(`/dashboard/rooms?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-inter">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        {/* <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: "url('https://placehold.co/1920x1080/000000/FFFFFF?text=Luxury+Hotel+Background')" }}></div> */}
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-4 animate-fade-in-up">
            Find Your Perfect Stay
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 animate-fade-in-up delay-200">
            Discover amazing hotels and rooms for your next adventure.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto bg-white p-2 rounded-full shadow-lg animate-fade-in-up delay-400">
            <div className="flex-grow flex items-center bg-gray-100 rounded-full px-4 py-2">
              <FaSearch className="text-gray-500 mr-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by city, hotel, or keyword..."
                className="flex-grow bg-transparent outline-none text-gray-800 placeholder-gray-500"
              />
            </div>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-semibold shadow-md transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-12">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center p-6 bg-blue-50 rounded-xl shadow-lg transform hover:scale-105 transition duration-300">
              <FaHotel className="text-5xl text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Vast Selection</h3>
              <p className="text-gray-600">
                Explore thousands of hotels and rooms worldwide, from budget-friendly to luxury.
              </p>
            </div>
            <div className="flex flex-col items-center p-6 bg-green-50 rounded-xl shadow-lg transform hover:scale-105 transition duration-300">
              <FaStar className="text-5xl text-green-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Best Prices</h3>
              <p className="text-gray-600">
                We guarantee the best rates with no hidden fees. Book with confidence.
              </p>
            </div>
            <div className="flex flex-col items-center p-6 bg-purple-50 rounded-xl shadow-lg transform hover:scale-105 transition duration-300">
              <FaMapMarkerAlt className="text-5xl text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Easy Booking</h3>
              <p className="text-gray-600">
                Our intuitive platform makes booking your next stay quick and hassle-free.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-gradient-to-r from-pink-500 to-red-600 text-white py-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">Ready for Your Next Adventure?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of happy travelers and book your dream hotel today!
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="bg-white text-pink-600 hover:bg-gray-100 px-10 py-4 rounded-full font-semibold text-lg shadow-xl transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
          >
            Get Started Now
          </button>
        </div>
      </section>
    </div>
  );
}

export default Home;
