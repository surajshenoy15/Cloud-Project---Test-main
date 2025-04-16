import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaCreditCard, FaLock, FaBolt, FaClock, FaArrowLeft } from 'react-icons/fa';

const Payment = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [invoiceData, setInvoiceData] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('invoiceData'));
    setInvoiceData(data);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      navigate(`/booking-confirmation/${id}`);
    }, 1500);
  };

  if (!invoiceData) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-lg">{invoiceData.stationName}</h3>
                  <p className="text-gray-600">{invoiceData.operator}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-medium">{invoiceData.duration} hour(s)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Rate per kWh</span>
                    <span className="font-medium">₹{invoiceData.price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Charger Type</span>
                    <span className="font-medium flex items-center">
                      <FaBolt className="text-amber-500 mr-1" />
                      {invoiceData.chargerType.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total Amount</span>
                    <span>₹{invoiceData.totalAmount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-6">
                <FaCreditCard className="text-3xl text-blue-600 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold">Payment Details</h1>
                  <p className="text-gray-600 text-sm mt-1">Complete your booking by providing payment information</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        transition-all duration-200 bg-gray-50 hover:bg-white"
                      maxLength="19"
                      onChange={(e) => {
                        const value = e.target.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
                        setPaymentDetails({ ...paymentDetails, cardNumber: value });
                      }}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        transition-all duration-200 bg-gray-50 hover:bg-white"
                      onChange={(e) => setPaymentDetails({ ...paymentDetails, cardName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                          transition-all duration-200 bg-gray-50 hover:bg-white"
                        maxLength="5"
                        onChange={(e) => {
                          const value = e.target.value
                            .replace(/\D/g, '')
                            .replace(/(\d{2})(\d)/, '$1/$2');
                          setPaymentDetails({ ...paymentDetails, expiry: value });
                        }}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                      <input
                        type="password"
                        placeholder="123"
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                          transition-all duration-200 bg-gray-50 hover:bg-white"
                        maxLength="3"
                        onChange={(e) => setPaymentDetails({ ...paymentDetails, cvv: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
                  <FaLock className="mr-2 text-blue-600" />
                  <span>Your payment information is secure and encrypted</span>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                    transition-all duration-200 flex items-center justify-center gap-2 font-medium
                    disabled:bg-blue-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl
                    transform hover:-translate-y-0.5"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <FaCreditCard /> Pay ₹{invoiceData.totalAmount}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;