# FASTIO Food Delivery App 🍔

A complete, production-ready food delivery application with restaurants, menu items, cart functionality, and FASTIO Pass subscription service.

## ✅ **FULLY FUNCTIONAL - NO BACKEND REQUIRED**

This app works completely locally with a built-in mock API system. No internet connection or external servers needed!

## 🚀 **How to Run**

```bash
# 1. Install dependencies
npm install

# 2. Start the app
npm run dev

# 3. Open http://localhost:3000
```

## 🎯 **Demo Credentials**

The app includes demo credentials for instant testing:

### **Login Credentials:**

- **Email**: `demo@fastio.com`
- **Password**: `Demo123@`

### **Admin Access:**

- **Email**: `admin@fastio.com`
- **Password**: `Admin123@`

### **OTP Verification:**

- **OTP Code**: `123456` (for any signup)

## ✨ **Complete Features**

### 🍕 **Restaurants & Food**

- **4 Full Restaurants**: Pizza Palace, Burger Junction, Sushi Zen, Taco Fiesta
- **15+ Menu Items**: Real food items with images, prices, descriptions
- **Categories**: Pizza, Burgers, Sushi, Mexican, Salads, Sides
- **Ratings & Reviews**: Star ratings and customer counts
- **Delivery Info**: Times, fees, minimum orders

### 🛒 **Shopping Experience**

- **Smart Cart**: Add/remove items, quantity management
- **Restaurant Validation**: Prevents mixing orders from different restaurants
- **Order Totals**: Subtotal, delivery fees, minimum order checks
- **Responsive Design**: Perfect on mobile, tablet, desktop

### 👤 **User Management**

- **Full Authentication**: Signup, login, OTP verification
- **User Profiles**: Profile management and account settings
- **Admin Portal**: Complete admin dashboard with user management

### ⚡ **FASTIO Pass**

- **Subscription Plans**: Monthly, Quarterly, Annual
- **Benefits**: Free delivery, cashback, priority support
- **Pricing**: Real subscription tiers with features

### 📱 **Modern UI/UX**

- **Responsive**: Mobile-first design, works on all devices
- **Fast Navigation**: Smooth transitions and loading states
- **Error Handling**: User-friendly error messages
- **Toast Notifications**: Real-time feedback

## 🏗️ **Architecture**

```
src/
├── components/          # Reusable UI components
├── contexts/           # Auth & Cart state management
├── data/              # Restaurant & food data
├── lib/               # API client & utilities
├── pages/             # All app pages
└── main.tsx           # App entry point
```

## 📄 **Available Pages**

- **Home** (`/`) - Landing page with features overview
- **Login** (`/login`) - User authentication
- **Signup** (`/signup`) - Account creation
- **OTP Verification** (`/verify-otp`) - Account verification
- **Restaurants** (`/restaurants`) - Browse all restaurants
- **Restaurant Detail** (`/restaurant/:id`) - Menu and ordering
- **Cart** (`/cart`) - Order management
- **Checkout** (`/checkout`) - Order completion
- **Orders** (`/orders`) - Order history
- **Profile** (`/profile`) - User account settings
- **FASTIO Pass** (`/fastio-pass`) - Subscription service
- **Admin Portal** (`/admin-portal`) - Admin access
- **Admin Dashboard** (`/admin`) - User management

## 🎨 **Design System**

- **Colors**: Orange/primary theme with proper contrast
- **Typography**: Poppins font family throughout
- **Icons**: Lucide React icon library
- **Components**: Consistent button, input, card components
- **Responsive**: Breakpoints for mobile, tablet, desktop

## 🛠️ **Tech Stack**

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: TailwindCSS 3, responsive utilities
- **State**: React Context API (Auth, Cart)
- **Routing**: React Router 6
- **Notifications**: Sonner toast library
- **Icons**: Lucide React
- **Build**: Vite with optimized bundling

## 🧪 **Testing Guide**

1. **Start App**: `npm run dev`
2. **Sign Up**: Create new account (any email format)
3. **Verify OTP**: Use `123456`
4. **Browse Restaurants**: Explore 4 different restaurants
5. **Add to Cart**: Order items from any restaurant
6. **Try FASTIO Pass**: Check subscription options
7. **Admin Access**: Use admin credentials for management

## 📦 **Build & Deploy**

```bash
# Production build
npm run build

# Preview build
npm run preview

# Type checking
npm run type-check
```

The built app is completely self-contained and can be deployed to any static hosting service.

## 🎉 **What Makes This Special**

1. **Complete Food Delivery App**: Not just a demo, but a fully functional app
2. **Real Data**: Actual restaurants, menus, and pricing
3. **No Backend Dependency**: Works 100% offline
4. **Production Ready**: Proper error handling, loading states, validation
5. **Modern Design**: Beautiful, responsive UI that feels like a real app
6. **Full Feature Set**: Everything you'd expect from a food delivery platform

**Ready to run immediately - just npm run dev and go! 🚀**
