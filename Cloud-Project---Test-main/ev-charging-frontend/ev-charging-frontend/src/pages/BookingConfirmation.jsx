


import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaCheckCircle, FaClock, FaMapMarkerAlt, FaBolt, FaReceipt, FaDownload } from 'react-icons/fa';
// Update imports
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';

const BookingConfirmation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    const invoiceData = JSON.parse(localStorage.getItem('invoiceData'));
    if (invoiceData) {
      const bookingData = {
        id: `BK${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        station: {
          name: invoiceData.stationName,
          operator: invoiceData.operator,
          location: 'Bangalore',
          type: invoiceData.chargerType,
          socket: invoiceData.socket || 'Type 2, CCS2',
          maxPower: invoiceData.maxPower || '50 kW'
        },
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        duration: `${invoiceData.duration} hour(s)`,
        amount: `₹${invoiceData.totalAmount}`,
        status: 'Confirmed',
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
          JSON.stringify({
            bookingId: `BK${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
            station: invoiceData.stationName,
            time: new Date().toISOString()
          })
        )}`
      };
      
      setBooking(bookingData);
      
      // Store in booking history
      const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      bookings.unshift(bookingData); // Add to start of array
      localStorage.setItem('bookings', JSON.stringify(bookings));
    }
  }, []);

  // Update the downloadReceipt function and add a new state
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadReceipt = () => {
    if (!booking) return;
    
    try {
      setIsDownloading(true);
      
      // Initialize document
      const doc = new jsPDF();
      
      // Add header
      doc.setFillColor(34, 197, 94);
      doc.rect(0, 0, 210, 40, 'F');
      
      // Add title
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.text('EV Charging Receipt', 105, 25, { align: 'center' });
      
      // Add content
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);

      // Generate table
      autoTable(doc, {
        startY: 50,
        head: [['Detail', 'Value']],
        body: [
          ['Booking ID:', booking.id],
          ['Date:', booking.date],
          ['Time:', booking.time],
          ['Station:', booking.station.name],
          ['Operator:', booking.station.operator],
          ['Location:', booking.station.location],
          ['Charger Type:', booking.station.type.toUpperCase()],
          ['Duration:', booking.duration],
          ['Amount:', booking.amount],
          ['Status:', booking.status]
        ],
        theme: 'striped',
        headStyles: { 
          fillColor: [34, 197, 94],
          textColor: [255, 255, 255]
        },
        styles: {
          fontSize: 12,
          cellPadding: 5
        }
      });

      // Add footer
      doc.setFontSize(10);
      doc.setTextColor(128, 128, 128);
      doc.text('Thank you for choosing our service!', 105, 280, { align: 'center' });

      // Save the PDF
      doc.save(`EV-Charging-Receipt-${booking.id}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  // Remove this standalone button component
  // <button onClick={downloadReceipt} ... /> should be removed from here

  if (!booking) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="container mx-auto max-w-lg">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <FaCheckCircle className="text-7xl text-green-500" />
              <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-2">
                <FaBolt className="text-xl" />
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-2 text-center">Booking Confirmed!</h1>
          <p className="text-gray-600 mb-8 text-center">Your charging session has been scheduled</p>

          <div className="bg-green-50 rounded-xl p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <p className="text-lg font-semibold text-green-800">Booking ID: {booking.id}</p>
              <button 
                onClick={() => setShowQR(!showQR)}
                className="text-green-700 hover:text-green-900"
              >
                {showQR ? 'Hide QR' : 'Show QR'}
              </button>
            </div>
            {showQR && (
              <div className="flex justify-center mb-4">
                <img src={booking.qrCode} alt="Booking QR Code" className="rounded-lg shadow-md" />
              </div>
            )}
          </div>

          <div className="space-y-6 border-t border-b border-gray-200 py-6 mb-8">
            <div className="flex items-start gap-4">
              <FaMapMarkerAlt className="text-red-500 mt-1 text-xl" />
              <div>
                <h3 className="font-semibold text-lg">{booking.station.name}</h3>
                <p className="text-gray-600">{booking.station.operator}</p>
                <p className="text-gray-500 text-sm mt-1">
                  Socket: {booking.station.socket} • Max Power: {booking.station.maxPower}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <FaBolt className="text-amber-500 text-xl" />
              <div>
                <p className="font-semibold">Charger Type</p>
                <p className="text-gray-600">{booking.station.type.toUpperCase()}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <FaClock className="text-blue-500 text-xl" />
              <div>
                <p className="font-semibold">{booking.date}</p>
                <p className="text-gray-600">{booking.time} ({booking.duration})</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <FaReceipt className="text-green-500 text-xl" />
              <div>
                <p className="font-semibold">Amount Paid</p>
                <p className="text-gray-600">{booking.amount}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={downloadReceipt}
              disabled={isDownloading}
              className="group relative flex items-center justify-center gap-2 px-6 py-3 bg-green-500 
                text-white rounded-lg hover:bg-green-600 transition-all duration-300 
                disabled:bg-green-400 disabled:cursor-wait overflow-hidden"
            >
              <div className={`flex items-center gap-2 transition-transform duration-300 
                ${isDownloading ? 'translate-y-10' : 'translate-y-0'}`}>
                <FaDownload className="text-lg" />
                <span>Download Receipt</span>
              </div>
              {isDownloading && (
                <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Generating...</span>
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-green-600 transform scale-x-0 group-hover:scale-x-100 
                transition-transform origin-left"></div>
            </button>
            <button
              onClick={() => navigate('/bookings')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                transition-colors"
            >
              View All Bookings
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 
                transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
