#!/bin/bash

# FASTIO Production Deployment Script
# Run: chmod +x deploy.sh && ./deploy.sh

echo "🚀 FASTIO Deployment Starting..."
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+ first.${NC}"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js version 18+ required. Current version: $(node -v)${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node -v) detected${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ npm $(npm -v) detected${NC}"

# Install dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Dependencies installed successfully${NC}"

# Run build
echo -e "${BLUE}🔨 Building application...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build completed successfully${NC}"

# Create deployment info
echo -e "${BLUE}📋 Creating deployment info...${NC}"

cat > dist/deployment-info.json << EOF
{
  "appName": "FASTIO - Food Delivery App",
  "version": "1.0.0",
  "buildDate": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "nodeVersion": "$(node -v)",
  "npmVersion": "$(npm -v)",
  "features": [
    "Real Email OTP Verification",
    "FASTIO Pass Premium Subscription",
    "Smart Order Cancellation",
    "Time-based Menu Categories",
    "Progressive Web App (PWA)",
    "Mobile-First Responsive Design",
    "Offline Support",
    "Push Notifications Ready"
  ],
  "deployment": {
    "platform": "Netlify",
    "buildCommand": "npm run build:client",
    "publishDirectory": "dist/spa",
    "functionsDirectory": "netlify/functions"
  },
  "requirements": {
    "node": "18+",
    "browsers": ["Chrome 90+", "Safari 14+", "Firefox 88+", "Edge 90+"]
  }
}
EOF

# Create environment template for production
echo -e "${BLUE}⚙️ Creating production environment template...${NC}"

cat > dist/.env.production.template << EOF
# FASTIO Production Environment Variables
# Copy this file to .env and configure for your deployment

# Application Environment
NODE_ENV=production

# Email Service Configuration (Required for OTP delivery)
EMAIL_USER=your-production-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Database Configuration (Optional - uses SQLite by default)
DATABASE_URL=file:./fastio.db

# Security Configuration (Optional - generates random if not set)
JWT_SECRET=your-super-secure-jwt-secret-key

# CORS Configuration (Optional)
ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com

# Feature Flags (Optional)
ENABLE_DEBUG_ROUTES=false
ENABLE_ADMIN_ROUTES=false
REQUIRE_EMAIL_VERIFICATION=true

# External Service Integration (Optional)
STRIPE_SECRET_KEY=sk_live_...
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
EOF

# Check build output
if [ -d "dist/spa" ] && [ -f "dist/spa/index.html" ]; then
    echo -e "${GREEN}✅ Client build output verified${NC}"
else
    echo -e "${RED}❌ Client build output missing${NC}"
    exit 1
fi

# Calculate bundle sizes
if [ -f "dist/spa/assets/index-*.js" ]; then
    JS_SIZE=$(ls -lh dist/spa/assets/index-*.js | awk '{print $5}')
    echo -e "${BLUE}📊 JavaScript bundle size: ${JS_SIZE}${NC}"
fi

if [ -f "dist/spa/assets/index-*.css" ]; then
    CSS_SIZE=$(ls -lh dist/spa/assets/index-*.css | awk '{print $5}')
    echo -e "${BLUE}📊 CSS bundle size: ${CSS_SIZE}${NC}"
fi

# Create quick deployment guide
echo -e "${BLUE}📝 Creating deployment guide...${NC}"

cat > DEPLOYMENT.md << EOF
# 🚀 FASTIO Deployment Guide

## Quick Deploy to Netlify

1. **Connect Repository**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository

2. **Configure Build Settings**
   - Build command: \`npm run build:client\`
   - Publish directory: \`dist/spa\`
   - Functions directory: \`netlify/functions\`

3. **Set Environment Variables**
   \`\`\`
   NODE_ENV=production
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   \`\`\`

4. **Deploy**
   - Click "Deploy site"
   - Your app will be live at: https://[random-name].netlify.app

## Custom Domain Setup

1. **Add Custom Domain**
   - Go to Site settings → Domain management
   - Add your domain (e.g., fastio-app.com)

2. **Configure DNS**
   - Point your domain to Netlify's servers
   - Enable HTTPS (automatic with Netlify)

3. **Update PWA Settings**
   - Update \`start_url\` in \`public/manifest.json\`
   - Update \`scope\` to your domain

## Production Checklist

- [ ] Email service configured and tested
- [ ] Environment variables set
- [ ] Custom domain configured
- [ ] HTTPS enabled
- [ ] PWA install tested on mobile devices
- [ ] Order flow tested end-to-end
- [ ] Database backup strategy in place

## Monitoring & Maintenance

- **Analytics**: Add Google Analytics or similar
- **Error Tracking**: Add Sentry or similar service
- **Performance**: Monitor Core Web Vitals
- **Database**: Regular backups and cleanup
- **Security**: Regular dependency updates

## Support

- **Email**: support@fastio.app
- **Documentation**: See README.md
- **Issues**: GitHub Issues
EOF

# Print deployment summary
echo ""
echo -e "${GREEN}🎉 DEPLOYMENT READY!${NC}"
echo "=================================="
echo -e "${BLUE}📁 Build Output:${NC} dist/spa/"
echo -e "${BLUE}📄 Deployment Guide:${NC} DEPLOYMENT.md"
echo -e "${BLUE}⚙️ Environment Template:${NC} dist/.env.production.template"
echo -e "${BLUE}📋 Deployment Info:${NC} dist/deployment-info.json"
echo ""
echo -e "${YELLOW}🚀 Next Steps:${NC}"
echo "1. Deploy dist/spa/ folder to your hosting provider"
echo "2. Configure environment variables for production"
echo "3. Set up custom domain and HTTPS"
echo "4. Test PWA installation on mobile devices"
echo ""
echo -e "${GREEN}✨ Your FASTIO app is ready for production!${NC}"
echo ""

# Open deployment guide
if command -v open &> /dev/null; then
    echo -e "${BLUE}📖 Opening deployment guide...${NC}"
    open DEPLOYMENT.md
elif command -v xdg-open &> /dev/null; then
    echo -e "${BLUE}📖 Opening deployment guide...${NC}"
    xdg-open DEPLOYMENT.md
fi

echo "🎯 Happy deploying!"
