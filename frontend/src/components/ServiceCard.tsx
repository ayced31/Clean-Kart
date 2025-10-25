import { Link } from 'react-router-dom';
import { Service } from '../types';

interface ServiceCardProps {
  service: Service;
}

const ServiceCard = ({ service }: ServiceCardProps) => {
  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="flex flex-col h-full">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{service.name}</h3>
          <p className="text-gray-600 text-sm">{service.description}</p>
        </div>

        <div className="mt-auto">
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-bold text-primary-600">
              ₹{service.basePrice}
            </span>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {service.category}
            </span>
          </div>

          <Link
            to={`/book/${service.id}`}
            className="block w-full text-center btn-primary"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
