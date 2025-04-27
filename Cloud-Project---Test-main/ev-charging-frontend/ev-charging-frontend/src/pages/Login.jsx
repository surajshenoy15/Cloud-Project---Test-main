import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaChargingStation, FaCar, FaBolt, FaLeaf } from 'react-icons/fa';

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  // EV-themed carousel images
  const carouselImages = [
    'https://images.unsplash.com/photo-1593941707882-a56bbc8df44c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1172&q=80',
    'https://images.unsplash.com/photo-1617886322168-72b886573c5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    'https://images.unsplash.com/photo-1647166545674-ce28ce93bdca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
  ];

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('https://cloud-project-test-main-3.onrender.com/api/login/', credentials);
      localStorage.setItem('token', response.data.token);
      toast.success('Login successful!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Logo and Carousel Section */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-800 to-blue-600 text-white p-8 flex flex-col justify-center">
        <div className="max-w-md mx-auto">
          <div className="flex items-center mb-8">
            <FaChargingStation className="text-5xl mr-4 text-green-400" />
            <h1 className="text-4xl font-bold">EV Charging Hub</h1>
          </div>
          
          <div className="relative h-64 mb-8 rounded-xl overflow-hidden shadow-2xl">
            {carouselImages.map((img, index) => (
              <div 
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img 
                  src={img} 
                  alt={`EV Charging ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
              {carouselImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full ${
                    index === currentSlide ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="flex items-center">
              <FaBolt className="text-2xl mr-3 text-yellow-300" />
              <div>
                <h3 className="font-bold">Fast Charging</h3>
                <p className="text-blue-100">Charge in minutes, not hours</p>
              </div>
            </div>
            <div className="flex items-center">
              <FaCar className="text-2xl mr-3 text-yellow-300" />
              <div>
                <h3 className="font-bold">All EV Models</h3>
                <p className="text-blue-100">Compatible with all vehicles</p>
              </div>
            </div>
            <div className="flex items-center">
              <FaLeaf className="text-2xl mr-3 text-green-300" />
              <div>
                <h3 className="font-bold">Eco-Friendly</h3>
                <p className="text-blue-100">Zero emissions, clean energy</p>
              </div>
            </div>
            <div className="flex items-center">
              <FaChargingStation className="text-2xl mr-3 text-green-300" />
              <div>
                <h3 className="font-bold">Wide Network</h3>
                <p className="text-blue-100">Stations across the country</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Form Section */}
      <div className="w-full md:w-1/2 bg-white p-8 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <input
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Username"
                  value={credentials.username}
                  onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                />
              </div>
              <div>
                <input
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>

            <div className="text-center">
              <Link to="/register" className="text-blue-600 hover:text-blue-800">
                Don't have an account? Register here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;