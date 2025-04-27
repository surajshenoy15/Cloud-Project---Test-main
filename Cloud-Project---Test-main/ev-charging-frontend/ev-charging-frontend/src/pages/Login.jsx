import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaChargingStation, FaCar, FaBolt, FaLeaf, FaMapMarkerAlt, FaPlug, FaLock, FaBatteryFull } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  // Updated high-quality EV-themed images
  const carouselImages = [
    'https://images.pexels.com/photos/4024914/pexels-photo-4024914.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // Modern EV charging station
    'https://images.pexels.com/photos/12805055/pexels-photo-12805055.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // EV dashboard closeup
    'https://images.pexels.com/photos/3846205/pexels-photo-3846205.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // Futuristic EV concept
    'https://images.pexels.com/photos/11627592/pexels-photo-11627592.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' // EV charging at sunset
  ];

  // Enhanced carousel captions
  const carouselCaptions = [
    {
      title: "Next-Gen Charging Network",
      subtitle: "Ultra-fast charging for the modern driver"
    },
    {
      title: "Smart Energy Management",
      subtitle: "Optimize your charging with AI technology"
    },
    {
      title: "Future of Mobility",
      subtitle: "Join the electric revolution today"
    },
    {
      title: "Sustainable Power",
      subtitle: "Clean energy for a greener tomorrow"
    }
  ];

  // Auto-rotate carousel with smooth transitions
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Using the correct API endpoint
      const response = await axios.post('https://cloud-project-test-main-3.onrender.com/api/users/login/', credentials);
      
      // Store token correctly
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        toast.success('Login successful!');
        navigate('/');
      } else {
        // Handle case where token is not in the expected format
        console.error('Invalid response format:', response.data);
        toast.error('Login failed: Invalid server response');
      }
    } catch (error) {
      console.error('Login error:', error);
      // More detailed error handling
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        toast.error(error.response.data?.detail || error.response.data?.error || 'Invalid credentials');
      } else if (error.request) {
        // The request was made but no response was received
        toast.error('Server not responding. Please try again later.');
      } else {
        // Something happened in setting up the request that triggered an Error
        toast.error('Login failed: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Enhanced animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.12,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 80, damping: 12 }
    }
  };

  // Particle animation for background
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 10 + 5,
    duration: Math.random() * 20 + 10
  }));

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 overflow-hidden">
      {/* Enhanced Logo and Carousel Section with Video Background */}
      <div className="w-full md:w-3/5 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 text-white p-8 flex flex-col justify-center relative overflow-hidden">
        {/* Animated particle background */}
        <div className="absolute inset-0 overflow-hidden">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full bg-white opacity-10"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
              }}
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            />
          ))}
          
          {/* Circuit-like lines in background */}
          <svg className="absolute inset-0 w-full h-full opacity-5" viewBox="0 0 100 100" preserveAspectRatio="none">
            <motion.path
              d="M0,50 Q25,30 50,50 T100,50"
              stroke="white"
              strokeWidth="0.5"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 5, repeat: Infinity, repeatType: "loop", ease: "linear" }}
            />
            <motion.path
              d="M0,30 Q35,60 70,30 T100,30"
              stroke="white"
              strokeWidth="0.5"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 7, repeat: Infinity, repeatType: "loop", ease: "linear", delay: 1 }}
            />
            <motion.path
              d="M0,70 Q45,40 80,70 T100,70"
              stroke="white"
              strokeWidth="0.5"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 6, repeat: Infinity, repeatType: "loop", ease: "linear", delay: 2 }}
            />
          </svg>
        </div>
        
        <motion.div 
          className="max-w-lg mx-auto relative z-10"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div 
            className="flex items-center mb-10" 
            variants={itemVariants}
          >
            <motion.div 
              className="p-4 bg-white/15 backdrop-blur-md rounded-2xl mr-5 shadow-lg"
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 0 25px rgba(59, 130, 246, 0.5)",
                backgroundColor: "rgba(255, 255, 255, 0.25)" 
              }}
            >
              <FaChargingStation className="text-5xl text-green-400" />
            </motion.div>
            <div>
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                EV Charging Hub
              </h1>
              <p className="text-blue-200 mt-1 text-lg">Power your journey, anywhere, anytime</p>
            </div>
          </motion.div>
          
          {/* Enhanced carousel with 3D effect */}
          <motion.div 
            className="relative h-80 mb-12 rounded-2xl overflow-hidden shadow-2xl"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            {carouselImages.map((img, index) => (
              <motion.div 
                key={index}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: index === currentSlide ? 1 : 0,
                  scale: index === currentSlide ? 1 : 1.1,
                  rotateY: index === currentSlide ? 0 : 5
                }}
                transition={{ 
                  opacity: { duration: 1.2 },
                  scale: { duration: 7 },
                  rotateY: { duration: 1 }
                }}
              >
                <img 
                  src={img} 
                  alt={`EV Charging ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
                
                {/* Enhanced overlay with animated gradient */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"
                  animate={{
                    background: [
                      "linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.4), transparent)",
                      "linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.5), transparent)"
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                />
                
                {/* Animated caption */}
                <motion.div 
                  className="absolute bottom-0 left-0 p-6"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ 
                    y: index === currentSlide ? 0 : 30,
                    opacity: index === currentSlide ? 1 : 0
                  }}
                  transition={{ delay: 0.3, duration: 0.7 }}
                >
                  <h3 className="text-2xl font-bold text-white">{carouselCaptions[index].title}</h3>
                  <p className="text-blue-100 text-sm mt-2">{carouselCaptions[index].subtitle}</p>
                  
                  {/* Animated highlight bar */}
                  <motion.div 
                    className="h-1 bg-green-400 rounded-full mt-3 w-16"
                    initial={{ width: 0 }}
                    animate={{ width: "4rem" }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                  />
                </motion.div>
                
                {/* Animated overlay elements */}
                <motion.div 
                  className="absolute top-6 right-6 flex items-center bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ 
                    x: index === currentSlide ? 0 : 20,
                    opacity: index === currentSlide ? 1 : 0
                  }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <FaBatteryFull className="text-green-400 mr-2" />
                  <span className="text-white text-sm font-medium">Eco-Friendly Power</span>
                </motion.div>
              </motion.div>
            ))}
            
            {/* Enhanced carousel indicators */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-3">
              {carouselImages.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className="group relative"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <motion.span 
                    className={`block h-1.5 rounded-full transition-all duration-300 ${
                      index === currentSlide ? 'bg-white w-10' : 'bg-white/40 w-6'
                    }`}
                    whileHover={{ backgroundColor: "rgba(255,255,255,0.9)" }}
                  />
                  <motion.span 
                    className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black/80 backdrop-blur-sm text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                    initial={{ y: 10, opacity: 0 }}
                    whileHover={{ y: 0, opacity: 1 }}
                  >
                    {carouselCaptions[index].title}
                  </motion.span>
                </motion.button>
              ))}
            </div>
          </motion.div>
          
          {/* Enhanced feature cards */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {[
              { icon: FaBolt, title: "Fast Charging", desc: "80% charge in just 20 minutes", color: "text-yellow-300", bgHover: "hover:bg-yellow-500/20", gradient: "from-yellow-400/20 to-yellow-600/10" },
              { icon: FaCar, title: "All EV Models", desc: "Universal compatibility", color: "text-yellow-300", bgHover: "hover:bg-yellow-500/20", gradient: "from-yellow-400/20 to-yellow-600/10" },
              { icon: FaLeaf, title: "Eco-Friendly", desc: "100% renewable energy sources", color: "text-green-300", bgHover: "hover:bg-green-500/20", gradient: "from-green-400/20 to-green-600/10" },
              { icon: FaMapMarkerAlt, title: "Wide Network", desc: "500+ stations nationwide", color: "text-green-300", bgHover: "hover:bg-green-500/20", gradient: "from-green-400/20 to-green-600/10" }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className={`flex items-start p-4 bg-gradient-to-br ${feature.gradient} backdrop-blur-sm rounded-xl ${feature.bgHover} transition-all duration-300 cursor-pointer border border-white/10`}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.05, 
                  y: -5,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                  borderColor: "rgba(255, 255, 255, 0.2)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                <feature.icon className={`text-2xl mr-3 ${feature.color} mt-1`} />
                <div>
                  <h3 className="font-bold">{feature.title}</h3>
                  <p className="text-blue-100 text-sm">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Enhanced Login Form Section */}
      <div className="w-full md:w-2/5 bg-white p-8 flex items-center justify-center">
        <motion.div 
          className="max-w-md w-full space-y-8"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="text-center">
            <motion.div 
              className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full mb-5 shadow-md"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaPlug className="text-3xl text-blue-600" />
            </motion.div>
            <motion.h2 
              className="text-3xl font-extrabold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Connect to Your Account
            </motion.h2>
            <motion.p 
              className="mt-2 text-gray-600"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Access your charging dashboard
            </motion.p>
          </div>
          
          {/* Rest of the form with enhanced styling */}
          <motion.form 
            className="mt-8 space-y-6" 
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="space-y-5">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaCar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="username"
                    type="text"
                    required
                    className="appearance-none block w-full pl-10 pr-3 py-3.5 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter your username"
                    value={credentials.username}
                    onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                  />
                  <motion.div 
                    className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none opacity-0"
                    animate={{ opacity: credentials.username ? 1 : 0 }}
                  >
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  </motion.div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    required
                    className="appearance-none block w-full pl-10 pr-3 py-3.5 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter your password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  />
                  <motion.div 
                    className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none opacity-0"
                    animate={{ opacity: credentials.password ? 1 : 0 }}
                  >
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <motion.button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 overflow-hidden"
                whileHover={{ scale: 1.02, boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)" }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.span 
                  className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-400/0 via-blue-400/50 to-blue-400/0"
                  animate={{ 
                    x: ['-100%', '100%'],
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 2,
                    ease: "linear",
                  }}
                />
                <span className="relative flex items-center">
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
                </span>
              </motion.button>
            </motion.div>

            <motion.div 
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium transition-colors inline-flex items-center">
                Don't have an account? 
                <motion.span 
                  className="ml-1 relative group"
                  whileHover={{ x: 2 }}
                >
                  Register here
                  <motion.span 
                    className="absolute -bottom-1 left-0 h-0.5 bg-blue-600 w-0 group-hover:w-full transition-all duration-300"
                    whileHover={{ width: "100%" }}
                  />
                </motion.span>
              </Link>
            </motion.div>
          </motion.form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;