# CleanKart - Local Laundry & Cleaning Service Portal

CleanKart is a full-stack web application that connects users with local laundry, cleaning, and car wash service providers. Built using the PERN stack (PostgreSQL, Express.js, React, Node.js) with TypeScript and following Service Oriented Architecture (SOA) principles.

## Features

### User Features
- User registration and authentication (JWT-based)
- Browse services by category (Laundry, Cleaning, Car Wash)
- View and select vendors based on ratings
- Book services with preferred date and time slots
- Manage bookings (view, cancel)
- Email notifications for booking updates (via Resend)
- SMS notifications (optional, via Twilio)

**Note:** Payment gateway integration is currently under maintenance and will be added in a future update.

### Vendor Features
- Vendor registration (requires admin approval)
- Vendor dashboard to manage bookings
- Accept/reject booking requests
- Update booking status (Pending → Confirmed → In Progress → Completed)
- Manage service offerings and availability
- View customer details and booking history

### Admin Features
- Approve/reject vendor registrations
- View all users, vendors, and bookings
- Monitor payments and transactions
- System-wide analytics

## Tech Stack

### Backend
- **Node.js** with **Express.js** - REST API server
- **TypeScript** - Type-safe development
- **NeonDB (PostgreSQL)** - Serverless PostgreSQL database
- **Prisma ORM** - Database toolkit and query builder
- **JWT** - Authentication and authorization
- **Bcrypt** - Password hashing
- **Twilio** - SMS notifications (optional)
- **Resend** - Email notifications (free tier available)

### Frontend
- **React 18** with **TypeScript**
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Zustand** - State management
- **Axios** - HTTP client
- **React Hook Form** - Form handling

## Architecture

The project follows a **Service Oriented Architecture (SOA)** with modular services:

1. **Authentication Service** - User/Vendor login, registration, JWT management
2. **Booking Service** - Create, manage, and track bookings
3. **Vendor Management Service** - Vendor profiles, approval, services offered
4. **Payment Service** - Razorpay integration, payment verification
5. **Notification Service** - Email/SMS notifications via SendGrid and Twilio

## Project Structure

```
cleankart/
├── backend/
│   ├── src/
│   │   ├── services/
│   │   │   ├── auth/           # Authentication service
│   │   │   ├── booking/        # Booking management
│   │   │   ├── vendor/         # Vendor management
│   │   │   ├── payment/        # Payment processing
│   │   │   └── notification/   # Email/SMS notifications
│   │   ├── routes/             # API routes
│   │   ├── middlewares/        # Auth, error handling
│   │   ├── db/                 # Prisma client
│   │   ├── types/              # TypeScript types
│   │   ├── utils/              # Helper functions
│   │   └── server.ts           # Express server
│   ├── prisma/
│   │   └── schema.prisma       # Database schema
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   ├── pages/              # Page components
│   │   ├── services/           # API service layer
│   │   ├── store/              # Zustand state management
│   │   ├── types/              # TypeScript types
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
│
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- NeonDB account (free tier available - [Sign up](https://neon.tech/))
- Resend account (free tier available - [Sign up](https://resend.com/))
- Twilio account (optional, for SMS - [Sign up](https://www.twilio.com/))

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your credentials:
   ```env
   # Get from NeonDB console
   DATABASE_URL="postgresql://user:pass@ep-xxx.region.aws.neon.tech/cleankart?sslmode=require"
   DIRECT_URL="postgresql://user:pass@ep-xxx.region.aws.neon.tech/cleankart?sslmode=require"

   PORT=5000
   JWT_SECRET=your_long_random_secret_key_here

   # Get from Resend (free tier)
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   RESEND_FROM_EMAIL=CleanKart <onboarding@resend.dev>

   # Optional - Twilio for SMS
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=xxxxxxxxxxxxx
   TWILIO_PHONE_NUMBER=+1234567890

   FRONTEND_URL=http://localhost:5173
   ```

4. **Set up NeonDB database**

   a. Create a NeonDB account at https://neon.tech/

   b. Create a new project and database

   c. Copy the connection string and update `.env`:
      - Use the pooled connection for `DATABASE_URL`
      - Use the direct connection for `DIRECT_URL`

   d. Generate Prisma client and run migrations:
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

5. **Seed the database (optional)**
   You can use Prisma Studio to manually add initial services:
   ```bash
   npm run prisma:studio
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment (optional)**
   Create `.env` file if you need to change the API URL:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

## API Documentation

### Authentication Endpoints

#### User Registration
```http
POST /api/auth/register/user
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+919876543210",
  "address": "123 Main St"
}
```

#### User Login
```http
POST /api/auth/login/user
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Vendor Registration
```http
POST /api/auth/register/vendor
Content-Type: application/json

{
  "name": "CleanPro Services",
  "email": "vendor@example.com",
  "password": "password123",
  "phone": "+919876543210",
  "address": "456 Business Ave",
  "description": "Professional cleaning services",
  "servicesOffered": ["service-id-1", "service-id-2"]
}
```

### Booking Endpoints

#### Get All Services
```http
GET /api/bookings/services
```

#### Create Booking
```http
POST /api/bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "vendorId": "vendor-uuid",
  "serviceId": "service-uuid",
  "slotDate": "2024-01-15",
  "slotTime": "09:00 AM - 12:00 PM",
  "address": "123 Main St",
  "notes": "Please call before arrival"
}
```

#### Get User Bookings
```http
GET /api/bookings/my-bookings
Authorization: Bearer <token>
```

### Vendor Endpoints

#### Get All Vendors
```http
GET /api/vendors?isApproved=true&serviceId=<service-id>
```

#### Update Vendor Profile
```http
PUT /api/vendors/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "phone": "+919876543210",
  "address": "New Address",
  "description": "Updated description",
  "servicesOffered": ["service-id-1"],
  "availableSlots": {}
}
```

### Payment Endpoints

#### Create Razorpay Order
```http
POST /api/payments/create-order/:bookingId
Authorization: Bearer <token>
```

#### Verify Payment
```http
POST /api/payments/verify
Authorization: Bearer <token>
Content-Type: application/json

{
  "razorpayOrderId": "order_xxx",
  "razorpayPaymentId": "pay_xxx",
  "razorpaySignature": "signature_xxx",
  "bookingId": "booking-uuid"
}
```

## Database Schema

### Main Tables
- **users** - User accounts (customers)
- **vendors** - Vendor accounts (service providers)
- **services** - Available services (Laundry, Cleaning, Car Wash)
- **bookings** - Service bookings with status tracking
- **payments** - Payment records with Razorpay integration
- **notifications** - Email/SMS notification logs

## Deployment

### Backend Deployment (Render/Railway/Heroku)

1. Push code to GitHub
2. Connect repository to your hosting platform
3. Set environment variables
4. Add PostgreSQL database addon
5. Deploy

### Frontend Deployment (Vercel/Netlify)

1. Push code to GitHub
2. Connect repository to Vercel/Netlify
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Add environment variable: `VITE_API_URL=<your-backend-url>/api`
6. Deploy

## Future Enhancements

- [ ] Vendor rating and review system
- [ ] Real-time chat between users and vendors (Socket.io)
- [ ] Geolocation-based vendor discovery (Google Maps API)
- [ ] Admin analytics dashboard
- [ ] Push notifications (Web Push API)
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Discount coupons and referral system

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Contact

For questions or support, please contact:
- Email: support@cleankart.com
- GitHub: [Your GitHub Profile]

---

Made with ❤️ using the PERN stack
