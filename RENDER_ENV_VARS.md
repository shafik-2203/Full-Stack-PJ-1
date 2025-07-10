# Environment Variables for Render.com Backend Deployment

Add these environment variables to your Render.com backend service:

## Required Environment Variables

```
MONGO_URI=mongodb+srv://mohamedshafik2526:ShafikMongo12345@cluster1.djqnrpm.mongodb.net/project0?retryWrites=true&w=majority

JWT_SECRET=fastio-super-secret-jwt-key-2024-production-ready-very-long-random-string

EMAIL_USER=mohamedshafik2526@gmail.com

EMAIL_PASS=qvjsjfoxkrllsyql

NODE_ENV=production

PORT=10000

FRONTEND_URL=https://fsd-project1-frontend.netlify.app
```

## How to Add Environment Variables on Render:

1. Go to your Render dashboard: https://dashboard.render.com/
2. Click on your backend service: `fsd-project1-backend`
3. Go to "Environment" tab
4. Click "Add Environment Variable"
5. Add each variable from the list above
6. Click "Save Changes"
7. Your service will automatically redeploy

## Verification:

After deployment, check your backend health endpoint:
https://fsd-project1-backend.onrender.com/health

Should return:

```json
{
  "success": true,
  "status": "healthy",
  "database": "MongoDB Connected",
  "mode": "production"
}
```
