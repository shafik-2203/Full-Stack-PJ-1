# 🚀 Complete Deployment Guide for FastIO Food Delivery

## 📋 Prerequisites

1. **MongoDB Atlas Account**: Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. **Render Account**: Sign up at [Render](https://render.com)
3. **Netlify Account**: Sign up at [Netlify](https://netlify.com)
4. **GitHub Repository**: Push your code to GitHub

## 🗄️ Step 1: Setup MongoDB Atlas

1. Create a new cluster in MongoDB Atlas
2. Create a database user with read/write privileges
3. Whitelist all IP addresses (0.0.0.0/0) for deployment
4. Get your connection string (it should look like):
   ```
   mongodb+srv://username:password@cluster.mongodb.net/fastio-food-delivery?retryWrites=true&w=majority
   ```

## 🖥️ Step 2: Deploy Backend to Render

1. **Connect GitHub Repository**:
   - Go to Render Dashboard
   - Click "New" → "Web Service"
   - Connect your GitHub repository

2. **Configure Build Settings**:
   - **Name**: `fastio-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Auto-Deploy**: Yes

3. **Environment Variables** (Add these in Render dashboard):

   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fastio-food-delivery?retryWrites=true&w=majority
   JWT_SECRET=your-super-secure-jwt-secret-key-here
   PORT=5001
   CORS_ORIGIN=https://your-app-name.netlify.app
   ```

4. **Deploy**: Click "Create Web Service"

## 🌐 Step 3: Deploy Frontend to Netlify

1. **Connect GitHub Repository**:
   - Go to Netlify Dashboard
   - Click "New site from Git"
   - Choose GitHub and select your repository

2. **Build Settings**:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`

3. **Environment Variables** (Add in Netlify dashboard):

   ```
   VITE_API_URL=https://your-backend-name.onrender.com
   ```

4. **Update netlify.toml**: Replace `your-backend.onrender.com` with your actual Render URL

## 🔄 Step 4: Update Configuration Files

1. **Update .env.production**:

   ```env
   MONGODB_URI=your-mongodb-atlas-connection-string
   JWT_SECRET=your-secure-jwt-secret
   PORT=5001
   NODE_ENV=production
   VITE_API_URL=https://your-backend.onrender.com
   CORS_ORIGIN=https://your-frontend.netlify.app
   ```

2. **Update netlify.toml**:
   ```toml
   [[redirects]]
     from = "/api/*"
     to = "https://your-actual-backend.onrender.com/api/:splat"
     status = 200
     force = true
   ```

## 🌱 Step 5: Seed Database (Optional)

Run this command locally to seed your MongoDB Atlas database:

```bash
NODE_ENV=production MONGODB_URI="your-connection-string" npm run deploy:seed
```

## 🔍 Step 6: Testing

1. **Backend Health Check**: Visit `https://your-backend.onrender.com/health`
2. **Frontend**: Visit `https://your-app.netlify.app`
3. **API Test**: Visit `https://your-backend.onrender.com/api/admin/dashboard`

## 🔧 Troubleshooting

### Common Issues:

1. **CORS Errors**: Make sure CORS_ORIGIN is set correctly in Render
2. **Database Connection**: Verify MongoDB connection string and IP whitelist
3. **Build Errors**: Check Node.js version (should be 18+)
4. **API Not Found**: Verify Netlify redirects are configured correctly

### Environment Variables Checklist:

**Render (Backend)**:

- ✅ NODE_ENV=production
- ✅ MONGODB_URI=your-atlas-connection-string
- ✅ JWT_SECRET=secure-random-string
- ✅ CORS_ORIGIN=https://your-app.netlify.app

**Netlify (Frontend)**:

- ✅ VITE_API_URL=https://your-backend.onrender.com

## 🎯 Default Login Credentials

- **Admin**: `fastio121299@gmail.com` / `fastio1212`
- **User**: `mohamedshafik2526@gmail.com` / `Shafik1212@`

## 🔐 Security Notes

1. Change default admin credentials after first login
2. Use strong JWT secrets
3. Regularly rotate database credentials
4. Monitor access logs

## 📱 Features Available

- ✅ User Authentication & Registration
- ✅ Admin Dashboard with MongoDB Integration
- ✅ Restaurant Management
- ✅ Food Item Management
- ✅ Order Management
- ✅ Payment Tracking
- ✅ Signup Request Management
- ✅ Real-time Data Persistence

Your FastIO Food Delivery app is now production-ready! 🎉
