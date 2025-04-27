import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaChargingStation, FaCar, FaBolt, FaLeaf, FaMapMarkerAlt, FaPlug, FaLock } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  // Professional EV-themed carousel images with guaranteed availability
  const carouselImages = [
    'https://images.pexels.com/photos/3693894/pexels-photo-3693894.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // EV charging
    'https://images.pexels.com/photos/9989079/pexels-photo-9989079.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // Tesla charging
    'https://images.pexels.com/photos/10553533/pexels-photo-10553533.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // Modern EV
    'https://images.pexels.com/photos/13861/IMG_3496bfree.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' // Charging station
  ];

  // Carousel captions for each slide
  const carouselCaptions = [
    {
      title: "Fast Charging Network",
      subtitle: "Power up your EV in minutes, not hours"
    },
    {
      title: "Smart Charging Solutions",
      subtitle: "Intelligent power management for all vehicles"
    },
    {
      title: "Nationwide Coverage",
      subtitle: "Find charging stations wherever you go"
    },
    {
      title: "Sustainable Energy",
      subtitle: "100% renewable power for your journey"
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

  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Enhanced Logo and Carousel Section */}
      <div className="w-full md:w-3/5 bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 text-white p-8 flex flex-col justify-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <motion.div 
              className="absolute top-10 left-10 w-20 h-20 rounded-full bg-green-400"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div 
              className="absolute top-40 right-20 w-32 h-32 rounded-full bg-blue-300"
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{ 
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            />
            <motion.div 
              className="absolute bottom-20 left-1/4 w-24 h-24 rounded-full bg-yellow-300"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.6, 0.9, 0.6]
              }}
              transition={{ 
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
            />
          </div>
        </div>
        
        <motion.div 
          className="max-w-lg mx-auto relative z-10"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div className="flex items-center mb-8" variants={itemVariants}>
            <div className="p-3 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl mr-4 shadow-lg">
              <FaChargingStation className="text-5xl text-green-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">EV Charging Hub</h1>
              <p className="text-blue-200 mt-1">Power your journey, anywhere, anytime</p>
            </div>
          </motion.div>
          
          <motion.div 
            className="relative h-80 mb-10 rounded-2xl overflow-hidden shadow-2xl"
            variants={itemVariants}
          >
            {carouselImages.map((img, index) => (
              <motion.div 
                key={index}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: index === currentSlide ? 1 : 0,
                  scale: index === currentSlide ? 1 : 1.1
                }}
                transition={{ 
                  opacity: { duration: 1 },
                  scale: { duration: 6 }
                }}
              >
                <img 
                  src={img} 
                  alt={`EV Charging ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <motion.div 
                  className="absolute bottom-0 left-0 p-6"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ 
                    y: index === currentSlide ? 0 : 20,
                    opacity: index === currentSlide ? 1 : 0
                  }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <h3 className="text-2xl font-bold">{carouselCaptions[index].title}</h3>
                  <p className="text-sm text-blue-100">{carouselCaptions[index].subtitle}</p>
                </motion.div>
              </motion.div>
            ))}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
              {carouselImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className="group relative"
                >
                  <span className={`block w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'bg-white w-8' : 'bg-white/50 group-hover:bg-white/70'
                  }`} />
                  <span className={`absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black/70 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap`}>
                    {carouselCaptions[index].title}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
          
          <div className="grid grid-cols-2 gap-6 mb-8">
            {[
              { icon: FaBolt, title: "Fast Charging", desc: "80% charge in just 30 minutes", color: "text-yellow-300", bgHover: "hover:bg-yellow-500/20" },
              { icon: FaCar, title: "All EV Models", desc: "Universal compatibility", color: "text-yellow-300", bgHover: "hover:bg-yellow-500/20" },
              { icon: FaLeaf, title: "Eco-Friendly", desc: "100% renewable energy sources", color: "text-green-300", bgHover: "hover:bg-green-500/20" },
              { icon: FaMapMarkerAlt, title: "Wide Network", desc: "500+ stations nationwide", color: "text-green-300", bgHover: "hover:bg-green-500/20" }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className={`flex items-start p-4 bg-white/10 backdrop-blur-sm rounded-xl ${feature.bgHover} transition-all duration-300 cursor-pointer`}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
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
              className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-full mb-4 shadow-md"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaPlug className="text-3xl text-blue-600" />
            </motion.div>
            <motion.h2 
              className="text-3xl font-extrabold text-gray-900"
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
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter your username"
                    value={credentials.username}
                    onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                  />
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
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter your password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  />
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
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
                whileHover={{ scale: 1.02, boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)" }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="absolute inset-0 overflow-hidden rounded-md">
                  <span className="absolute inset-0 -translate-x-full hover:translate-x-0 bg-gradient-to-r from-blue-400 to-blue-600 transition-transform ease-out duration-500 group-hover:translate-x-0"></span>
                </span>
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
                <span className="ml-1 relative group">
                  Register here
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                </span>
              </Link>
            </motion.div>
          </motion.form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;