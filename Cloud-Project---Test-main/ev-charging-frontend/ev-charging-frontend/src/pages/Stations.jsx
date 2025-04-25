import React, { useState, useEffect } from 'react';
import { FaBolt, FaFilter, FaClock, FaMapMarkerAlt, FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Stations = () => {
  const [stations, setStations] = useState([]);
  const [filteredStations, setFilteredStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    fastCharging: false,
    type: 'all',
    maxPrice: 100,
    availability: false
  });
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Get stations data from Home page
    const getBangaloreStations = () => [
      {
        id: 'blr1',
        name: 'Tata Power - Indiranagar Metro',
        position: [12.9784, 77.6408],
        operator: 'Tata Power',
        socket: 'Type 2, CCS2',
        capacity: '4',
        maxPower: '60 kW',
        authentication: 'App',
        fee: true,
        price: 12.00,
        availability: true,
        isFastCharging: true,
        type: 'dc',
        rating: '4.8'
      },
      // ... other stations
    ];

    const stationsData = getBangaloreStations();
    setStations(stationsData);
    setFilteredStations(stationsData);
    setLoading(false);
  }, []);

  // Remove the first useEffect that was loading hardcoded stations

  useEffect(() => {
    const fetchStations = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('https://cloud-project-test-main-3.onrender.com/api/stations/', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            lat: 12.9716,
            lng: 77.5946,
            radius: 5000
          }
        });

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
        setFilteredStations(formattedStations);
      } catch (error) {
        console.error("Error fetching stations:", error);
        if (error.response?.status === 401) {
          navigate('/login');
        } else {
          // Fallback to hardcoded stations if API fails
          const stationsData = getBangaloreStations();
          setStations(stationsData);
          setFilteredStations(stationsData);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, [navigate]);

  // Add separate useEffect for filters
  useEffect(() => {
    let filtered = [...stations];

    if (filters.fastCharging) {
      filtered = filtered.filter(station => station.isFastCharging);
    }

    if (filters.type !== 'all') {
      filtered = filtered.filter(station => station.type === filters.type);
    }

    filtered = filtered.filter(station => station.price <= filters.maxPrice);

    if (filters.availability) {
      filtered = filtered.filter(station => station.availability);
    }

    setFilteredStations(filtered);
  }, [filters, stations]);

  const handleBooking = (station) => {
    const bookingData = {
      stationId: station.id,
      stationName: station.name,
      operator: station.operator,
      price: station.price,
      chargerType: station.type
    };
    localStorage.setItem('currentBooking', JSON.stringify(bookingData));
    navigate(`/invoice/${station.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Charging Stations</h1>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg
              hover:bg-blue-700 transition-colors"
          >
            <FaFilter /> Filters
          </button>
        </div>

        {showFilters && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.fastCharging}
                    onChange={(e) => setFilters({...filters, fastCharging: e.target.checked})}
                    className="rounded text-blue-600"
                  />
                  Fast Charging
                </label>
              </div>

              <div>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({...filters, type: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="all">All Types</option>
                  <option value="ac">AC</option>
                  <option value="dc">DC</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1">Max Price (₹)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({...filters, maxPrice: Number(e.target.value)})}
                  className="w-full"
                />
                <div className="text-right">₹{filters.maxPrice}</div>
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.availability}
                    onChange={(e) => setFilters({...filters, availability: e.target.checked})}
                    className="rounded text-blue-600"
                  />
                  Available Now
                </label>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStations.map(station => (
            <div key={station.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-xl">{station.name}</h3>
                    <p className="text-gray-600">{station.operator}</p>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500">
                    <FaStar /> {station.rating}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-red-500" />
                    <span>Bangalore</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaBolt className="text-amber-500" />
                    <span>{station.socket}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaClock className="text-blue-500" />
                    <span>{station.availability ? 'Available' : 'Occupied'}</span>
                  </div>
                  <div className="text-lg font-semibold">₹{station.price}/kWh</div>
                </div>

                <button
                  onClick={() => handleBooking(station)}
                  disabled={!station.availability}
                  className="mt-4 w-full py-2 bg-green-500 text-white rounded-lg 
                    hover:bg-green-600 transition-colors disabled:bg-gray-300"
                >
                  {station.availability ? 'Book Now' : 'Currently Unavailable'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredStations.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            No stations found matching your filters
          </div>
        )}
      </div>
    </div>
  );
};

export default Stations;
