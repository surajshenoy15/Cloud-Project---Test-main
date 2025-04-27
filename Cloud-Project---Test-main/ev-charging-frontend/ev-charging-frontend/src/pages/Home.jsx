



import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import { 
  FaSearch, 
  FaFilter, 
  FaStar, 
  FaRegStar, 
  FaMapMarkerAlt, 
  FaUser,
  FaCar, 
  FaClock,
  FaEdit, 
} from 'react-icons/fa';
// Remove these duplicate imports
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// Fix for default marker icons in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

// Custom marker for EV stations
// Update the evStationIcon definition near the top of your file
const evStationIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Add this import at the top
import { useNavigate } from 'react-router-dom';

// Update the default location to Bangalore
const Homepage = () => {
  const navigate = useNavigate();
  // Add these new state variables near the top with other state declarations
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  // Add this new function with other function declarations
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  // Add this effect to check login status when token changes
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);
  const [userLocation, setUserLocation] = useState([12.9716, 77.5946]); // Bangalore center

  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    fastCharging: false,
    type: 'all', // 'all', 'ac', 'dc'
    maxPrice: 100,
    availability: false
  });
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const mapRef = useRef(null);

  // Get user location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    }
    
    // Load favorites and recent searches from localStorage
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) setRecentSearches(JSON.parse(savedSearches));
  }, []);

  // Fetch charging stations whenever user location changes
  useEffect(() => {
    fetchNearbyStations();
  }, [userLocation]);

  // Function to fetch nearby charging stations using Overpass API (part of OpenStreetMap)
  // Add this near the top of your component
  const [retryTimeout, setRetryTimeout] = useState(null);
  
  // Update fetchNearbyStations function
  const fetchNearbyStations = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
  
      const response = await axios.get('https://cloud-project-test-main-3.onrender.com/api/stations/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        params: {
          latitude: userLocation[0],  // Changed from lat to latitude
          longitude: userLocation[1], // Changed from lng to longitude
          radius: 5000
        }
      });
  
      if (response.data) {
        const formattedStations = response.data.map(station => ({
          id: station.id,
          name: station.name,
          position: [station.latitude, station.longitude],
          operator: station.operator,
          socket: station.charging_types.join(', '),
          capacity: station.available_ports.toString(),
          maxPower: station.power_output,
          authentication: 'App',
          fee: true,
          price: station.price_per_kwh,
          availability: station.is_active,
          isFastCharging: station.power_output.split(' ')[0] >= 50,
          type: station.charging_types.includes('DC') ? 'dc' : 'ac',
          rating: station.rating
        }));
        setStations(formattedStations);
      }
    } catch (error) {
      console.error("Error fetching stations:", error);
      if (error.response?.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        navigate('/login');
      } else {
        // Fallback to hardcoded stations if API fails
        const stations = getBangaloreStations();
        setStations(stations);
      }
    } finally {
      setLoading(false);
    }
  };

  // Update handleBooking function
  const handleBooking = async (station) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to make a booking');
        navigate('/login');
        return;
      }
  
      const bookingData = {
        station_id: station.id,  // Remove parseInt since ID might be a string
        station_name: station.name,
        duration: 1,  // Changed from duration_hours
        price: parseFloat(station.price),  // Changed from total_cost
        charger_type: station.type.toUpperCase(),
        status: 'PENDING',
        booking_time: new Date().toISOString()  // Keep ISO format
      };
  
      console.log('Sending booking data:', bookingData);
  
      // Ensure we're using the correct API endpoint
      const API_BASE_URL = 'https://cloud-project-test-main-3.onrender.com';
      const response = await axios.post(`${API_BASE_URL}/api/bookings/`, bookingData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (response.data) {
        // Store booking data for invoice page
        localStorage.setItem('currentBooking', JSON.stringify({
          ...response.data,
          stationName: station.name,
          operator: station.operator,
          price: station.price,
          chargerType: station.type,
          duration: 1
        }));
        
        navigate('/invoice');
      }
    } catch (error) {
      console.error("Error creating booking:", error.response?.data || error);
      if (error.response?.status === 401) {
        toast.error('Please login again');
        navigate('/login');
      } else if (error.response?.status === 400) {
        toast.error(error.response?.data?.detail || 'Invalid booking data');
      } else if (error.response?.status === 500) {
        if (error.response?.data?.includes('no such table')) {
          toast.error('Booking system is being initialized. Please try again in a few minutes.');
        } else {
          toast.error('Server error. Please try again later.');
        }
      } else {
        toast.error('Unable to create booking. Please try again later.');
      }
    }
  };

  // Remove this entire standalone button section
  /* DELETE FROM HERE
  <button 
    onClick={(e) => {
      e.stopPropagation();
      handleBooking(station);
    }}
    className="px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 
      transition-colors flex items-center gap-1 text-sm font-medium"
    disabled={!station.availability}
  >
    <FaClock size={14} /> Book
  </button>
  DELETE TO HERE */

  const getBangaloreStations = () => {
    return [
      {
        id: 'blr1',
        name: 'Tata Power - Whitefield Mall',
        position: [12.9698, 77.7500],
        operator: 'Tata Power',
        socket: 'Type 2, CCS2',
        capacity: '6',
        maxPower: '60 kW',
        authentication: 'App',
        fee: true,
        price: 14.50,
        availability: true,
        isFastCharging: true,
        type: 'dc',
        charging_types: ['DC', 'CCS2', 'Type 2'],
        rating: '4.7'
      },
      {
        id: 'blr2',
        name: 'BESCOM - MG Road Metro',
        position: [12.9758, 77.6197],
        operator: 'BESCOM',
        socket: 'Type 2',
        capacity: '4',
        maxPower: '22 kW',
        authentication: 'RFID/App',
        fee: true,
        price: 8.00,
        availability: true,
        isFastCharging: false,
        type: 'ac',
        charging_types: ['AC', 'Type 2'],
        rating: '4.2'
      },
      {
        id: 'blr3',
        name: 'Ather Grid - Forum Mall',
        position: [12.9343, 77.6115],
        operator: 'Ather Energy',
        socket: 'CCS2, CHAdeMO',
        capacity: '4',
        maxPower: '50 kW',
        authentication: 'App',
        fee: true,
        price: 13.00,
        availability: true,
        isFastCharging: true,
        type: 'dc',
        charging_types: ['DC', 'CCS2', 'CHAdeMO'],
        rating: '4.5'
      },
      {
        id: 'blr4',
        name: 'Shell Electric - Marathahalli',
        position: [12.9591, 77.7010],
        operator: 'Shell',
        socket: 'Type 2, CCS2',
        capacity: '8',
        maxPower: '75 kW',
        authentication: 'App/Card',
        fee: true,
        price: 15.50,
        availability: true,
        isFastCharging: true,
        type: 'dc',
        charging_types: ['DC', 'CCS2', 'Type 2'],
        rating: '4.8'
      },
      {
        id: 'blr5',
        name: 'Indian Oil EV - Jayanagar',
        position: [12.9250, 77.5938],
        operator: 'Indian Oil',
        socket: 'CCS2, Type 2',
        capacity: '5',
        maxPower: '50 kW',
        authentication: 'App',
        fee: true,
        price: 12.50,
        availability: true,
        isFastCharging: true,
        type: 'dc',
        charging_types: ['DC', 'CCS2', 'Type 2'],
        rating: '4.4'
      }
    ];
  };

  // Add cleanup in useEffect
  useEffect(() => {
    return () => {
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, [retryTimeout]);

  // Filter stations based on user filters
  const filteredStations = stations.filter(station => {
    // Text search
    const matchesSearch = searchQuery === '' || 
      station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.operator.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filters
    const matchesFastCharging = !filters.fastCharging || station.isFastCharging;
    const matchesType = filters.type === 'all' || station.type === filters.type;
    const matchesPrice = station.price <= filters.maxPrice;
    const matchesAvailability = !filters.availability || station.availability;
    
    return matchesSearch && matchesFastCharging && matchesType && matchesPrice && matchesAvailability;
  });

  // Handle search location
  const handleSearch = async () => {
    if (searchQuery.trim() === '') return;
    
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      );
      
      if (response.data && response.data.length > 0) {
        const location = response.data[0];
        const newLocation = [parseFloat(location.lat), parseFloat(location.lon)];
        setUserLocation(newLocation);
        
        // Save to recent searches
        const updatedSearches = [
          { 
            query: searchQuery, 
            location: newLocation 
          }, 
          ...recentSearches.filter(s => s.query !== searchQuery)
        ].slice(0, 5);
        
        setRecentSearches(updatedSearches);
        localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
      }
    } catch (error) {
      console.error("Error searching location:", error);
    }
  };

  // Toggle favorite station
  const toggleFavorite = (station) => {
    let updatedFavorites;
    if (favorites.some(fav => fav.id === station.id)) {
      updatedFavorites = favorites.filter(fav => fav.id !== station.id);
    } else {
      updatedFavorites = [...favorites, station];
    }
    
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  // Navigate to station
  const navigateToStation = (station) => {
    window.open(`https://www.openstreetmap.org/directions?from=${userLocation[0]},${userLocation[1]}&to=${station.position[0]},${station.position[1]}&type=car`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <ToastContainer position="top-right" autoClose={3000} />
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto py-6 px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold cursor-pointer" onClick={() => navigate('/')}>
                <span className="text-blue-200">EV</span> Charging Hub
              </h1>
              <div className="hidden md:flex space-x-4">
                {/* <button 
                  onClick={() => navigate('/stations')}
                  className="text-blue-200 hover:text-white transition-colors"
                >
                  Stations
                </button> */}
                <button 
                  onClick={() => navigate('/bookings')}
                  className="text-blue-200 hover:text-white transition-colors"
                >
                  Bookings
                </button>
                {/* <button 
                  onClick={() => navigate('/rewards')}
                  className="text-blue-200 hover:text-white transition-colors"
                >
                  Rewards
                </button> */}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search location or station..."
                  className="w-64 pl-4 pr-10 py-2 rounded-xl bg-white/10 backdrop-blur-sm
                    border border-white/20 text-white placeholder-blue-200 
                    focus:outline-none focus:ring-2 focus:ring-white/30"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-200" />
              </div>
              
              {/* <button 
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                <FaFilter className="text-blue-200" />
              </button>
               */}
              {isLoggedIn ? (
                <div className="flex items-center gap-4">
                  {/* <span className="text-sm">100 Points</span> */}
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center cursor-pointer"
                       onClick={() => navigate('/profile')}>
                    <FaUser />
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate('/login')}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Register
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Filters Panel */}
      <div className={`transform transition-all duration-300 ${showFilters ? 'max-h-96' : 'max-h-0'} overflow-hidden`}>
        <div className="container mx-auto p-4">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-700">Charger Type</h3>
                <div className="flex flex-wrap gap-2">
                  <button className={`px-4 py-2 rounded-lg ${filters.type === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>
                    All
                  </button>
                  <button className={`px-4 py-2 rounded-lg ${filters.type === 'ac' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>
                    AC
                  </button>
                  <button className={`px-4 py-2 rounded-lg ${filters.type === 'dc' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>
                    DC
                  </button>
                </div>
              </div>

              {/* ... other filter sections ... */}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Station List */}
          <div className="lg:w-2/5 h-[calc(100vh-12rem)] overflow-y-auto">
            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Nearby Stations</h2>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {filteredStations.length} found
                </span>
              </div>

              {/* Station Cards */}
              <div className="space-y-4">
                {filteredStations.map(station => (
                  <div 
                    key={station.id}
                    className="group bg-gray-50 rounded-lg p-4 hover:bg-gray-100 
                      transition-all duration-200 cursor-pointer transform hover:-translate-y-1"
                    onClick={() => mapRef.current?.flyTo(station.position, 16)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-xl mb-1">{station.name}</h3>
                        <p className="text-gray-600">{station.operator}</p>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(station);
                        }}
                        className="text-yellow-500 hover:scale-110 transition-transform p-2"
                      >
                        {favorites.some(fav => fav.id === station.id) ? <FaStar size={20} /> : <FaRegStar size={20} />}
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-3 mb-4">
                      <span className={`px-3 py-1.5 rounded-full text-sm font-medium
                        ${station.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {station.availability ? '● Available' : '● Occupied'}
                      </span>
                      <span className="px-3 py-1.5 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                        {station.type.toUpperCase()}
                      </span>
                      {station.isFastCharging && (
                        <span className="px-3 py-1.5 rounded-full bg-amber-100 text-amber-800 text-sm font-medium">
                          ⚡ Fast Charging
                        </span>
                      )}
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        {/* // Update the price display in the station card */}
                        <div className="text-lg font-semibold">
                          ₹{(Number(station.price) || 0).toFixed(2)}/kWh
                        </div>
                        <div className="flex items-center text-amber-500">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i}>{i < Math.floor(station.rating) ? '★' : '☆'}</span>
                          ))}
                          <span className="ml-1 text-gray-600 text-sm">({station.rating})</span>
                        </div>
                      </div>
                      {/* Inside the station card buttons div */}
                      <div className="flex gap-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingStation(station);
                            setShowEditModal(true);
                          }}
                          className="px-3 py-1.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 
                            transition-colors flex items-center gap-1 text-sm font-medium"
                        >
                          <FaEdit size={14} /> Edit
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBooking(station);
                          }}
                          className="px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 
                            transition-colors flex items-center gap-1 text-sm font-medium"
                          disabled={!station.availability}
                        >
                          <FaClock size={14} /> Book
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigateToStation(station);
                          }}
                          className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                            transition-colors flex items-center gap-1 text-sm font-medium"
                        >
                          <FaMapMarkerAlt size={14} /> Navigate
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Map Container */}
          <div className="lg:w-3/5 h-[calc(100vh-12rem)] bg-white rounded-xl shadow-lg overflow-hidden">
            <MapContainer 
              center={userLocation} 
              zoom={12}
              className="h-full"
              whenCreated={map => (mapRef.current = map)}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {/* User Location Marker */}
              <Marker position={userLocation}>
                <Popup>
                  Your Location
                </Popup>
              </Marker>

              {/* Station Markers */}
              {filteredStations.map(station => (
                <Marker 
                  key={station.id}
                  position={station.position}
                  icon={evStationIcon}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-semibold">{station.name}</h3>
                      <p className="text-sm text-gray-600">{station.operator}</p>
                      <div className="mt-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          station.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {station.availability ? '● Available' : '● Occupied'}
                        </span>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm">Type: {station.type.toUpperCase()}</p>
                        {/* // Update the price display in the map popup */}
                        <p className="text-sm">
                          Price: ₹{(Number(station.price) || 0).toFixed(2)}/kWh
                        </p>
                        <p className="text-sm">Rating: {station.rating}/5</p>
                      </div>
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() => toggleFavorite(station)}
                          className="px-2 py-1 text-sm bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200"
                        >
                          {favorites.some(fav => fav.id === station.id) ? 'Remove Favorite' : 'Add Favorite'}
                        </button>
                        <button
                          onClick={() => navigateToStation(station)}
                          className="px-2 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                        >
                          Navigate
                        </button>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;

const [editingStation, setEditingStation] = useState(null);
const [showEditModal, setShowEditModal] = useState(false);

// Add this new function
const handleUpdateStation = async (updatedStationData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to update station');
      navigate('/login');
      return;
    }

    const API_BASE_URL = 'https://cloud-project-test-main-3.onrender.com';
    const response = await axios.put(
      `${API_BASE_URL}/api/stations/${updatedStationData.id}/`,
      updatedStationData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data) {
      toast.success('Station updated successfully');
      fetchNearbyStations(); // Refresh the stations list
      setShowEditModal(false);
      setEditingStation(null);
    }
  } catch (error) {
    console.error("Error updating station:", error);
    toast.error(error.response?.data?.detail || 'Failed to update station');
  }
};

{/* Add this before the closing div of the return statement */}
  {showEditModal && editingStation && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Edit Station</h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          handleUpdateStation(editingStation);
        }}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={editingStation.name}
                onChange={(e) => setEditingStation({...editingStation, name: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Price per kWh</label>
              <input
                type="number"
                value={editingStation.price}
                onChange={(e) => setEditingStation({...editingStation, price: parseFloat(e.target.value)})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Available Ports</label>
              <input
                type="number"
                value={editingStation.capacity}
                onChange={(e) => setEditingStation({...editingStation, capacity: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                value={editingStation.availability ? "true" : "false"}
                onChange={(e) => setEditingStation({...editingStation, availability: e.target.value === "true"})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="true">Available</option>
                <option value="false">Occupied</option>
              </select>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setShowEditModal(false);
                setEditingStation(null);
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )}