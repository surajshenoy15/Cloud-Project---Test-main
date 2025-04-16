import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Stations from './pages/Stations';
import Bookings from './pages/Bookings';
import StationList from "./pages/StationList";
import StationDetails from "./pages/StationDetails";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BookingConfirmation from "./pages/BookingConfirmation";
import Invoice from './pages/Invoice';
import Payment from './pages/Payment';
import { Toaster } from 'react-hot-toast';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Main routes */}
              <Route path="/" element={<Home />} />
              <Route path="/stations" element={<StationList />} />
              <Route path="/bookings" element={<Bookings />} />
              <Route path="/profile" element={<Profile />} />
              
              {/* Station details */}
              <Route path="/stations/:stationId" element={<StationDetails />} />
              
              {/* Booking flow */}
              <Route path="/invoice" element={<Invoice />} />
              <Route path="/invoice/:stationId" element={<Invoice />} />
              <Route path="/payment/:paymentId" element={<Payment />} />
              <Route path="/booking-confirmation/:bookingId" element={<BookingConfirmation />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </>
  );
}

export default App;
