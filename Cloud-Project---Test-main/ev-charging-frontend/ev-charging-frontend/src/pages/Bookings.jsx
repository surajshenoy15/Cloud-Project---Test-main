import React, { useState, useEffect, Fragment, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaMapMarkerAlt, FaClock, FaBolt, FaDownload, FaMoneyBill } from 'react-icons/fa';
import { Dialog, Transition } from '@headlessui/react';
import html2canvas from 'html2canvas';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const receiptRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to view bookings');
        navigate('/login');
        return;
      }

      // Changed to GET request
      const response = await axios.get('https://cloud-project-test-main-3.onrender.com/api/bookings/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data) {
        setBookings(response.data);
        setError(null);
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        toast.error('Session expired. Please login again');
        navigate('/login');
      } else {
        setError('Failed to fetch bookings');
        toast.error('Failed to fetch bookings');
      }
    } finally {
      setLoading(false);
    }
  };

  const downloadReceipt = async (booking) => {
    setSelectedBooking(booking);
    setIsReceiptOpen(true);
  };

  const handleDownload = async () => {
    if (receiptRef.current) {
      try {
        const canvas = await html2canvas(receiptRef.current, {
          backgroundColor: '#ffffff',
          scale: 2,
          useCORS: true,
          removeContainer: true,
          onclone: (clonedDoc) => {
            const element = clonedDoc.querySelector('[ref="receiptRef"]');
            if (element) {
              // Replace modern color values with web-safe alternatives
              element.style.backgroundColor = '#ffffff';
              element.style.color = '#000000';
            }
          }
        });
        const url = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `ev-receipt-${selectedBooking.id}.png`;
        link.href = url;
        link.click();
      } catch (error) {
        console.error('Receipt generation failed:', error);
        toast.error('Failed to generate receipt');
      }
    }
    setIsReceiptOpen(false);
  };

  // Update the receipt container styling
  <div ref={receiptRef} className="bg-white p-6" style={{ backgroundColor: '#ffffff', color: '#000000' }}>
    <div className="text-center mb-6">
      <h2 className="text-2xl font-bold text-gray-800">EV Charging Receipt</h2>
      <p className="text-gray-500">Thank you for choosing us!</p>
    </div>

    {selectedBooking && (
      <>
        <div className="border-t border-b border-gray-200 py-4 mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Receipt No:</span>
            <span className="font-semibold">#{selectedBooking.id}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Customer:</span>
            <span className="font-semibold">{localStorage.getItem('username') || 'User'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date:</span>
            <span>{selectedBooking.date}</span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Station Details</h3>
            <p className="text-gray-600">{selectedBooking.station.name}</p>
            <p className="text-gray-600">{selectedBooking.station.location}</p>
            <p className="text-gray-600">Type: {selectedBooking.station.type?.toUpperCase()}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Booking Details</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-gray-600">Time:</p>
                <p className="font-medium">{selectedBooking.time}</p>
              </div>
              <div>
                <p className="text-gray-600">Duration:</p>
                <p className="font-medium">{selectedBooking.duration}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center text-lg font-semibold">
            <span>Total Amount:</span>
            <span>₹{selectedBooking.amount}</span>
          </div>
        </div>
      </>
    )}
  </div>

  const cancelBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Updated endpoint to match Django's URL pattern
      await axios.post(`https://cloud-project-test-main-3.onrender.com/api/bookings/${bookingId}/cancel/`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      toast.success('Booking cancelled successfully');
      fetchBookings();
    } catch (err) {
      console.error('Cancel booking error:', err);
      toast.error('Failed to cancel booking');
      if (err.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-green-100 text-green-800',
      'completed': 'bg-blue-100 text-blue-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid gap-6">
          {bookings.map(booking => (
            <div key={booking.id || booking.booking_id} 
                 className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-xl">{booking.station.name}</h3>
                  <p className="text-gray-600">Booking ID: {booking.id || booking.booking_id}</p>
                </div>
                <div className={`px-4 py-2 rounded-lg ${getStatusColor(booking.status)}`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-red-500" />
                    <span>{booking.station.location || 'Bangalore'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaClock className="text-blue-500" />
                    <span>{booking.date} at {booking.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaBolt className="text-amber-500" />
                    <span>
                      {booking.station.type && `Charger Type: ${booking.station.type.toUpperCase()}`}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <FaClock className="text-purple-500" />
                    <span>Duration: {booking.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaMoneyBill className="text-emerald-500" />
                    <span>Amount: ₹{booking.amount}</span>
                  </div>
                  <button
                    onClick={() => downloadReceipt(booking)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                  >
                    <FaDownload /> Download Receipt
                  </button>
                </div>
              </div>

              {booking.status === 'pending' && (
                <button
                  onClick={() => cancelBooking(booking.id || booking.booking_id)}
                  className="mt-4 w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Cancel Booking
                </button>
              )}
            </div>
          ))}

          {bookings.length === 0 && !loading && (
            <div className="text-center text-gray-500 py-8">
              No bookings found
            </div>
          )}
        </div>
      </div>

      <Transition appear show={isReceiptOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsReceiptOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl p-6 shadow-xl transition-all" style={{ backgroundColor: '#ffffff' }}>
                  <div 
                    ref={receiptRef} 
                    style={{
                      backgroundColor: '#ffffff',
                      color: '#000000',
                      padding: '1.5rem',
                    }}
                  >
                    <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>EV Charging Receipt</h2>
                      <p style={{ color: '#6b7280' }}>Thank you for choosing us!</p>
                    </div>

                    {selectedBooking && (
                      <>
                        <div style={{ 
                          borderTop: '1px solid #e5e7eb', 
                          borderBottom: '1px solid #e5e7eb',
                          padding: '1rem 0',
                          marginBottom: '1rem' 
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ color: '#4b5563' }}>Receipt No:</span>
                            <span style={{ fontWeight: '600' }}>#{selectedBooking.id}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ color: '#4b5563' }}>Customer:</span>
                            <span style={{ fontWeight: '600' }}>{localStorage.getItem('username') || 'User'}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#4b5563' }}>Date:</span>
                            <span>{selectedBooking.date}</span>
                          </div>
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                          <div style={{ marginBottom: '1rem' }}>
                            <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Station Details</h3>
                            <p style={{ color: '#4b5563' }}>{selectedBooking.station.name}</p>
                            <p style={{ color: '#4b5563' }}>{selectedBooking.station.location}</p>
                            <p style={{ color: '#4b5563' }}>Type: {selectedBooking.station.type?.toUpperCase()}</p>
                          </div>

                          <div>
                            <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Booking Details</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                              <div>
                                <p style={{ color: '#4b5563' }}>Time:</p>
                                <p style={{ fontWeight: '500' }}>{selectedBooking.time}</p>
                              </div>
                              <div>
                                <p style={{ color: '#4b5563' }}>Duration:</p>
                                <p style={{ fontWeight: '500' }}>{selectedBooking.duration}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div style={{ 
                          marginTop: '1.5rem', 
                          borderTop: '1px solid #e5e7eb', 
                          paddingTop: '1rem' 
                        }}>
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            marginBottom: '0.5rem',
                            color: '#4b5563'
                          }}>
                            <span>Power Consumption Rate:</span>
                            <span>₹{selectedBooking.station.price || 0}/kWh</span>
                          </div>
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            marginBottom: '0.5rem',
                            color: '#4b5563'
                          }}>
                            <span>Duration:</span>
                            <span>{selectedBooking.duration} hours</span>
                          </div>
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            marginBottom: '0.5rem',
                            color: '#4b5563'
                          }}>
                            <span>Power Rate per Hour:</span>
                            <span>{selectedBooking.station.power_output || 7.4} kW</span>
                          </div>
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            marginBottom: '0.5rem',
                            color: '#4b5563'
                          }}>
                            <span>Total Power Consumption:</span>
                            <span>{(selectedBooking.station.power_output || 7.4) * selectedBooking.duration} kWh</span>
                          </div>
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            fontSize: '1.125rem',
                            fontWeight: '600',
                            marginTop: '1rem'
                          }}>
                            <span>Total Amount:</span>
                            <span>₹{((selectedBooking.station.price || 0) * (selectedBooking.station.power_output || 7.4) * selectedBooking.duration).toFixed(2)}</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                    <button
                      onClick={handleDownload}
                      style={{
                        backgroundColor: '#2563eb',
                        color: '#ffffff',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                        fontWeight: '500'
                      }}
                    >
                      Download Receipt
                    </button>
                    <button
                      onClick={() => setIsReceiptOpen(false)}
                      style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #d1d5db',
                        color: '#374151',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                        fontWeight: '500'
                      }}
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default Bookings;