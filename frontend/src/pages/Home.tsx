import { Link } from 'react-router-dom';

const Home = () => {
  const categories = [
    {
      name: 'Laundry Services',
      description: 'Professional laundry pickup and delivery at your doorstep',
      icon: '🧺',
      link: '/services?category=LAUNDRY',
    },
    {
      name: 'Home Cleaning',
      description: 'Expert cleaning services for your home and office',
      icon: '🧹',
      link: '/services?category=CLEANING',
    },
    {
      name: 'Car Wash',
      description: 'Premium car washing and detailing services',
      icon: '🚗',
      link: '/services?category=CAR_WASH',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to CleanKart
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Your one-stop solution for laundry, cleaning, and car wash services
            </p>
            <Link to="/services" className="inline-block bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition">
              Explore Services
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={category.link}
                className="card hover:shadow-xl transition-shadow duration-200 text-center"
              >
                <div className="text-6xl mb-4">{category.icon}</div>
                <h3 className="text-2xl font-semibold mb-3 text-gray-800">
                  {category.name}
                </h3>
                <p className="text-gray-600">{category.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Choose Service', description: 'Select from our range of services' },
              { step: '2', title: 'Select Vendor', description: 'Pick a trusted local vendor' },
              { step: '3', title: 'Book Slot', description: 'Choose your preferred date and time' },
              { step: '4', title: 'Get Service', description: 'Sit back and relax' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            Ready to get started?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Book your first service today and experience the convenience
          </p>
          <Link to="/register" className="btn-primary text-lg">
            Sign Up Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
