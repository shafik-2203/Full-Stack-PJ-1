#!/bin/bash

echo "🚀 FastIO Food Delivery Deployment Script"
echo "=========================================="

# Check if git is available
if ! command -v git &> /dev/null; then
    echo "❌ Git is required but not installed."
    exit 1
fi

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ This is not a git repository. Please run 'git init' first."
    exit 1
fi

echo "✅ Git repository detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

echo "✅ Build successful"

# Commit changes
echo "💾 Committing changes..."
git add .
git commit -m "Deploy: Ready for production deployment" || echo "No changes to commit"

# Push to remote
echo "📤 Pushing to remote repository..."
git push origin main || git push origin master

echo ""
echo "🎉 Deployment preparation complete!"
echo ""
echo "Next steps:"
echo "1. 🗄️  Set up MongoDB Atlas cluster"
echo "2. 🖥️  Deploy backend to Render with your repository"
echo "3. 🌐 Deploy frontend to Netlify with your repository"
echo "4. 🔧 Update environment variables in both platforms"
echo "5. 🌱 Run database seeding: npm run deploy:seed"
echo ""
echo "For detailed instructions, see: DEPLOYMENT_COMPLETE_GUIDE.md"
echo ""
echo "🔗 Your app will be available at:"
echo "   Frontend: https://your-app-name.netlify.app"
echo "   Backend:  https://your-backend-name.onrender.com"
