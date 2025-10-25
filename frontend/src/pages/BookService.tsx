import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookingService } from '../services/bookingService';
import { vendorService } from '../services/vendorService';
import { Service, Vendor } from '../types';

const BookService = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    vendorId: '',
    slotDate: '',
    slotTime: '',
    address: '',
    notes: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (serviceId) {
      loadData();
    }
  }, [serviceId]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load all services to get the specific service
      const servicesResponse = await bookingService.getAllServices();
      const foundService = servicesResponse.data?.find(s => s.id === serviceId);
      if (foundService) {
        setService(foundService);
      }

      // Load vendors for this service
      const vendorsResponse = await vendorService.getVendorsByService(serviceId!);
      if (vendorsResponse.data) {
        setVendors(vendorsResponse.data);
      }
    } catch (err) {
      console.error('Failed to load data:', err);
      setError('Failed to load booking information');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.vendorId) {
      setError('Please select a vendor');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await bookingService.createBooking({
        vendorId: formData.vendorId,
        serviceId: serviceId!,
        slotDate: new Date(formData.slotDate),
        slotTime: formData.slotTime,
        address: formData.address,
        notes: formData.notes,
      });

      alert('Booking created successfully!');
      navigate('/my-bookings');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Service not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{service.name}</h1>
          <p className="text-gray-600 mb-4">{service.description}</p>
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold text-primary-600">₹{service.basePrice}</span>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {service.category}
            </span>
          </div>
        </div>

        <div className="card">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Book This Service</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="vendorId" className="block text-sm font-medium text-gray-700 mb-2">
                Select Vendor *
              </label>
              {vendors.length === 0 ? (
                <p className="text-gray-600">No vendors available for this service.</p>
              ) : (
                <select
                  id="vendorId"
                  name="vendorId"
                  required
                  className="input-field"
                  value={formData.vendorId}
                  onChange={handleChange}
                >
                  <option value="">Choose a vendor</option>
                  {vendors.map((vendor) => (
                    <option key={vendor.id} value={vendor.id}>
                      {vendor.name} - {vendor.rating} ⭐ ({vendor.totalReviews} reviews)
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="slotDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Service Date *
                </label>
                <input
                  id="slotDate"
                  name="slotDate"
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="input-field"
                  value={formData.slotDate}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="slotTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Time *
                </label>
                <select
                  id="slotTime"
                  name="slotTime"
                  required
                  className="input-field"
                  value={formData.slotTime}
                  onChange={handleChange}
                >
                  <option value="">Select time</option>
                  <option value="09:00 AM - 12:00 PM">Morning (9 AM - 12 PM)</option>
                  <option value="12:00 PM - 03:00 PM">Afternoon (12 PM - 3 PM)</option>
                  <option value="03:00 PM - 06:00 PM">Evening (3 PM - 6 PM)</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Service Address *
              </label>
              <textarea
                id="address"
                name="address"
                rows={3}
                required
                className="input-field"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your complete address"
              />
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                className="input-field"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any special instructions or requirements"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitting || vendors.length === 0}
                className="flex-1 btn-primary"
              >
                {submitting ? 'Creating Booking...' : 'Confirm Booking'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/services')}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookService;
