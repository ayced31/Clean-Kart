import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import UnifiedRegister from './pages/UnifiedRegister';
import Services from './pages/Services';
import BookService from './pages/BookService';
import MyBookings from './pages/MyBookings';
import VendorDashboard from './pages/VendorDashboard';

function App() {
  const { checkAuth, isAuthenticated, isVendor } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<UnifiedRegister />} />
            <Route path="/services" element={<Services />} />
            <Route
              path="/book/:serviceId"
              element={isAuthenticated ? <BookService /> : <Navigate to="/login" />}
            />
            <Route
              path="/my-bookings"
              element={isAuthenticated && !isVendor ? <MyBookings /> : <Navigate to="/login" />}
            />
            <Route
              path="/vendor-dashboard"
              element={isAuthenticated && isVendor ? <VendorDashboard /> : <Navigate to="/login" />}
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
