import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaChargingStation, FaCar, FaBolt, FaLeaf, FaMapMarkerAlt, FaPlug } from 'react-icons/fa';

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  // Enhanced EV-themed carousel images
  const carouselImages = [
    'https://images.unsplash.com/photo-1647166545674-ce28ce93bdca?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
    'https://images.unsplash.com/photo-1593941707882-a56bbc8df44c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1172&q=80',
    'https://images.unsplash.com/photo-1617886322168-72b886573c5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
    'https://images.unsplash.com/photo-1558025137-0b406e9cc169?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80'
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
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Enhanced Logo and Carousel Section */}
      <div className="w-full md:w-3/5 bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 text-white p-8 flex flex-col justify-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-green-400 animate-pulse"></div>
            <div className="absolute top-40 right-20 w-32 h-32 rounded-full bg-blue-300 animate-pulse" style={{animationDelay: '1s'}}></div>
            <div className="absolute bottom-20 left-1/4 w-24 h-24 rounded-full bg-yellow-300 animate-pulse" style={{animationDelay: '2s'}}></div>
          </div>
        </div>
        
        <div className="max-w-lg mx-auto relative z-10">
          <div className="flex items-center mb-8">
            <div className="p-3 bg-white bg-opacity-20 rounded-xl mr-4">
              <FaChargingStation className="text-5xl text-green-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">EV Charging Hub</h1>
              <p className="text-blue-200 mt-1">Power your journey, anywhere, anytime</p>
            </div>
          </div>
          
          <div className="relative h-72 mb-10 rounded-2xl overflow-hidden shadow-2xl">
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="text-xl font-bold">Sustainable Mobility</h3>
                  <p className="text-sm text-blue-100">Powering the future of transportation</p>
                </div>
              </div>
            ))}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
              {carouselImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'bg-white w-6' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="flex items-start p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-300">
              <FaBolt className="text-2xl mr-3 text-yellow-300 mt-1" />
              <div>
                <h3 className="font-bold">Fast Charging</h3>
                <p className="text-blue-100 text-sm">80% charge in just 30 minutes</p>
              </div>
            </div>
            <div className="flex items-start p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-300">
              <FaCar className="text-2xl mr-3 text-yellow-300 mt-1" />
              <div>
                <h3 className="font-bold">All EV Models</h3>
                <p className="text-blue-100 text-sm">Universal compatibility</p>
              </div>
            </div>
            <div className="flex items-start p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-300">
              <FaLeaf className="text-2xl mr-3 text-green-300 mt-1" />
              <div>
                <h3 className="font-bold">Eco-Friendly</h3>
                <p className="text-blue-100 text-sm">100% renewable energy sources</p>
              </div>
            </div>
            <div className="flex items-start p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-300">
              <FaMapMarkerAlt className="text-2xl mr-3 text-green-300 mt-1" />
              <div>
                <h3 className="font-bold">Wide Network</h3>
                <p className="text-blue-100 text-sm">500+ stations nationwide</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Login Form Section */}
      <div className="w-full md:w-2/5 bg-white p-8 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center p-2 bg-blue-50 rounded-full mb-4">
              <FaPlug className="text-3xl text-blue-600" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Connect to Your Account
            </h2>
            <p className="mt-2 text-gray-600">Access your charging dashboard</p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="username"
                    type="text"
                    required
                    className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter your username"
                    value={credentials.username}
                    onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="password"
                    type="password"
                    required
                    className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter your password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-[1.02]"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <FaChargingStation className="mr-2" />
                    Sign in
                  </span>
                )}
              </button>
            </div>

            <div className="text-center">
              <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
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