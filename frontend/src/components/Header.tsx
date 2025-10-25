import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const Header = () => {
  const { isAuthenticated, isVendor, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-primary-600">CleanKart</h1>
          </Link>

          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary-600 transition">
              Home
            </Link>
            <Link to="/services" className="text-gray-700 hover:text-primary-600 transition">
              Services
            </Link>
            {isAuthenticated && !isVendor && (
              <Link to="/my-bookings" className="text-gray-700 hover:text-primary-600 transition">
                My Bookings
              </Link>
            )}
            {isAuthenticated && isVendor && (
              <Link to="/vendor-dashboard" className="text-gray-700 hover:text-primary-600 transition">
                Dashboard
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="text-right">
                  <span className="text-gray-700 font-medium">Hi, {user?.name}</span>
                  <span className="block text-xs text-gray-500">
                    {isVendor ? '🏪 Service Provider' : '👤 Customer'}
                  </span>
                </div>
                <button onClick={handleLogout} className="btn-secondary text-sm">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary-600">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
