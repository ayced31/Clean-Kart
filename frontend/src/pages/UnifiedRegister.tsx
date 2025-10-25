import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { bookingService } from '../services/bookingService';
import { useAuthStore } from '../store/authStore';
import { Service } from '../types';

const UnifiedRegister = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [isVendor, setIsVendor] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    description: '',
    servicesOffered: [] as string[],
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isVendor) {
      loadServices();
    }
  }, [isVendor]);

  const loadServices = async () => {
    try {
      const response = await bookingService.getAllServices();
      if (response.data) {
        setServices(response.data);
      }
    } catch (err) {
      console.error('Failed to load services:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleServiceToggle = (serviceId: string) => {
    setFormData({
      ...formData,
      servicesOffered: formData.servicesOffered.includes(serviceId)
        ? formData.servicesOffered.filter(id => id !== serviceId)
        : [...formData.servicesOffered, serviceId],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isVendor && formData.servicesOffered.length === 0) {
      setError('Please select at least one service');
      return;
    }

    if (isVendor && !formData.phone) {
      setError('Phone number is required for service providers');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = isVendor
        ? await authService.registerVendor(formData)
        : await authService.registerUser(formData);

      const user = response.data.user || response.data.vendor;
      if (user) {
        setAuth(user, response.data.token);
        navigate(isVendor ? '/vendor-dashboard' : '/');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="card">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
            <p className="text-gray-600 mt-2">Join CleanKart today</p>
          </div>

          {/* Account Type Toggle */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
              I am a:
            </label>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setIsVendor(false)}
                className={`flex-1 py-3 rounded-md transition font-medium ${
                  !isVendor
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                👤 Customer
              </button>
              <button
                type="button"
                onClick={() => setIsVendor(true)}
                className={`flex-1 py-3 rounded-md transition font-medium ${
                  isVendor
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                🏪 Service Provider
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Common Fields */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                {isVendor ? 'Business Name' : 'Full Name'} *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="input-field"
                placeholder={isVendor ? 'e.g., CleanPro Services' : 'e.g., John Doe'}
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="input-field"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  className="input-field"
                  placeholder="Min. 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number {isVendor && '*'}
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required={isVendor}
                className="input-field"
                placeholder="+91 1234567890"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Address {isVendor && '*'}
              </label>
              <textarea
                id="address"
                name="address"
                rows={2}
                required={isVendor}
                className="input-field"
                placeholder={isVendor ? 'Business address' : 'Your address (optional)'}
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            {/* Vendor-Specific Fields */}
            {isVendor && (
              <>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Business Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    className="input-field"
                    placeholder="Tell customers about your business..."
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Services Offered *
                  </label>
                  {services.length === 0 ? (
                    <div className="text-gray-500 text-sm">Loading services...</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {services.map((service) => (
                        <label
                          key={service.id}
                          className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                        >
                          <input
                            type="checkbox"
                            checked={formData.servicesOffered.includes(service.id)}
                            onChange={() => handleServiceToggle(service.id)}
                            className="mr-3 h-4 w-4 text-primary-600"
                          />
                          <div>
                            <div className="font-medium text-gray-800">{service.name}</div>
                            <div className="text-sm text-gray-500">{service.category}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 hover:underline font-semibold">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedRegister;
