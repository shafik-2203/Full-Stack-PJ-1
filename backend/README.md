# FASTIO Backend API

Production-ready Node.js backend for FASTIO food delivery application.

## 🚀 Features

- **Authentication**: JWT-based authentication with OTP verification
- **MongoDB**: Database with Mongoose ODM
- **Email Service**: OTP sending via Gmail/SMTP
- **Security**: Helmet, CORS, Rate limiting
- **RESTful API**: Complete CRUD operations
- **Error Handling**: Comprehensive error management
- **Validation**: Input validation and sanitization

## 📦 Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create `.env` file from `.env.example`:

```bash
cp .env.example .env
```

4. Update environment variables in `.env`

5. Start the server:

```bash
# Development
npm run dev

# Production
npm start
```

## 🌐 Environment Variables

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-secret-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
PORT=10000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.netlify.app
```

## 📚 API Endpoints

### Authentication

- `POST /api/auth/signup` - User registration
- `POST /api/auth/verify-otp` - Verify OTP and create account
- `POST /api/auth/login` - User login
- `POST /api/auth/resend-otp` - Resend OTP

### Restaurants

- `GET /api/restaurants` - Get all restaurants
- `GET /api/restaurants/search` - Search restaurants
- `GET /api/restaurants/categories` - Get categories
- `GET /api/restaurants/:id` - Get single restaurant
- `GET /api/restaurants/:id/menu` - Get restaurant menu

### User Profile

- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `POST /api/user/change-password` - Change password
- `GET /api/user/addresses` - Get addresses
- `POST /api/user/addresses` - Add address

### Orders

- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `PATCH /api/orders/:id/cancel` - Cancel order
- `POST /api/orders/:id/review` - Rate and review

## 🛡️ Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: API rate limiting
- **JWT**: Secure token-based authentication
- **Password Hashing**: bcryptjs for password security
- **Input Validation**: Comprehensive validation

## 🚀 Deployment (Render)

1. Create new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables in Render dashboard
6. Deploy!

## 📱 Database Models

- **User**: User accounts and profiles
- **PendingSignup**: Temporary signup data
- **Restaurant**: Restaurant information
- **MenuItem**: Menu items for restaurants
- **Order**: Order management

## 🧪 Testing

```bash
# Test API endpoints
curl http://localhost:10000/health
```

## 📄 License

MIT License - see LICENSE file for details.
