# CleanKart Backend API

RESTful API built with Node.js, Express, TypeScript, and NeonDB (PostgreSQL) for the CleanKart service booking platform.

## Quick Setup

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and update values
3. Generate Prisma client: `npm run prisma:generate`
4. Run migrations: `npm run prisma:migrate`
5. Start dev server: `npm run dev`

See [../QUICK_START.md](../QUICK_START.md) for detailed setup.

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register/user` | Register a new user | No |
| POST | `/api/auth/register/vendor` | Register a new vendor | No |
| POST | `/api/auth/login/user` | User login | No |
| POST | `/api/auth/login/vendor` | Vendor login | No |
| GET | `/api/auth/profile/user` | Get user profile | Yes (USER) |
| GET | `/api/auth/profile/vendor` | Get vendor profile | Yes (VENDOR) |

### Bookings

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/bookings/services` | Get all active services | No |
| GET | `/api/bookings/services/category/:category` | Get services by category | No |
| POST | `/api/bookings` | Create a new booking | Yes (USER) |
| GET | `/api/bookings/my-bookings` | Get user's bookings | Yes (USER) |
| GET | `/api/bookings/vendor-bookings` | Get vendor's bookings | Yes (VENDOR) |
| GET | `/api/bookings/:id` | Get booking by ID | Yes |
| PATCH | `/api/bookings/:id/status` | Update booking status | Yes (VENDOR) |
| PATCH | `/api/bookings/:id/cancel` | Cancel a booking | Yes (USER) |

### Vendors

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/vendors` | Get all vendors (with filters) | No |
| GET | `/api/vendors/by-service/:serviceId` | Get vendors by service | No |
| GET | `/api/vendors/:id` | Get vendor by ID | No |
| PUT | `/api/vendors/profile` | Update vendor profile | Yes (VENDOR) |
| PATCH | `/api/vendors/:id/approve` | Approve vendor | Yes (ADMIN) |
| DELETE | `/api/vendors/:id/reject` | Reject vendor | Yes (ADMIN) |

### Payments

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/payments/create-order/:bookingId` | Create Razorpay order | Yes (USER) |
| POST | `/api/payments/verify` | Verify payment | Yes (USER) |
| GET | `/api/payments/booking/:bookingId` | Get payment by booking | Yes |
| GET | `/api/payments` | Get all payments | Yes (ADMIN) |

### Notifications

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/notifications` | Get user notifications | Yes (USER) |
| POST | `/api/notifications/booking/:bookingId` | Send booking notification | Yes |

## Running the Server

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

## Database Commands

```bash
# Generate Prisma client
npm run prisma:generate

# Create migration
npm run prisma:migrate

# Open Prisma Studio
npm run prisma:studio
```

## Environment Variables

See `.env.example` for required configuration.
