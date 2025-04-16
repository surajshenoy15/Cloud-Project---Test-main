import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaClock, FaBolt, FaMapMarkerAlt, FaCarBattery, FaMoneyBillWave } from 'react-icons/fa';

const Invoice = () => {
  const { stationId } = useParams();
  const navigate = useNavigate();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [duration, setDuration] = useState(1);
  const [estimatedEnergy, setEstimatedEnergy] = useState(0);

  useEffect(() => {
    const details = JSON.parse(localStorage.getItem('currentBooking'));
    if (!details) {
      navigate('/');
      return;
    }
    setBookingDetails(details);
    // Estimate energy consumption based on charger type and duration
    const baseConsumption = details.chargerType.toLowerCase() === 'dc' ? 50 : 7.5;
    setEstimatedEnergy(baseConsumption * duration);
  }, [duration, navigate]);

  const calculateTotal = () => {
    if (!bookingDetails) return 0;
    const energyCost = (Number(bookingDetails.price) * estimatedEnergy).toFixed(2);
    const serviceFee = (2.00 * duration).toFixed(2);
    return (Number(energyCost) + Number(serviceFee)).toFixed(2);
  };

  const handleProceed = () => {
    const invoiceData = {
      ...bookingDetails,
      duration,
      estimatedEnergy,
      serviceFee: (2.00 * duration).toFixed(2),
      totalAmount: calculateTotal(),
      invoiceNumber: `INV-${Date.now()}`,
      date: new Date().toLocaleDateString(),
      bookingTime: new Date().toISOString()
    };
    localStorage.setItem('invoiceData', JSON.stringify(invoiceData));
    navigate(`/payment/${stationId}`);
  };

  if (!bookingDetails) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 mb-6 hover:text-blue-800"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold mb-6">Booking Details</h1>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{bookingDetails.stationName}</h2>
                <p className="text-gray-600">{bookingDetails.operator}</p>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <FaMapMarkerAlt className="mr-1" /> {bookingDetails.address || 'Location details'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="text-gray-600">Charger Type</div>
                <div className="text-lg font-semibold flex items-center">
                  <FaBolt className="mr-2 text-amber-500" />
                  {bookingDetails.chargerType.toUpperCase()}
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="text-gray-600">Rate per kWh</div>
                <div className="text-lg font-semibold flex items-center">
                  <FaMoneyBillWave className="mr-2 text-green-500" />
                  ₹{Number(bookingDetails.price).toFixed(2)}
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="text-gray-600">Est. Energy</div>
                <div className="text-lg font-semibold flex items-center">
                  <FaCarBattery className="mr-2 text-blue-500" />
                  {estimatedEnergy.toFixed(1)} kWh
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <label className="block text-gray-600 mb-2">Select Duration</label>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full p-2 border rounded-md"
              >
                {[1, 2, 3, 4].map(hour => (
                  <option key={hour} value={hour}>{hour} Hour{hour > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Energy Cost</span>
                <span>₹{(Number(bookingDetails.price) * estimatedEnergy).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Service Fee</span>
                <span>₹{(2.00 * duration).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-lg font-semibold pt-2 border-t">
                <span>Total Amount</span>
                <span>₹{calculateTotal()}</span>
              </div>
            </div>

            <button
              onClick={handleProceed}
              className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600
                transition-colors flex items-center justify-center gap-2 font-semibold"
            >
              <FaClock /> Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;