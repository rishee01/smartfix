# 🚀 CivicSense Deployment Guide

## Overview
CivicSense is optimized for deployment on **Vercel**, **Render**, **Heroku**, and other Node.js hosting platforms. The project is configured to run from the root directory with a single entry point.

## Project Structure for Deployment

```
civicsense/
├── backend/           # Node.js + Express API server
│   ├── server.js      # Main server file (serves frontend + API)
│   ├── routes.js      # API endpoints
│   ├── models.js      # Data models & algorithms
│   ├── db.js          # Database configuration
│   └── package.json   # Backend dependencies
├── frontend/          # React + Vite (builds to dist/)
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── admin/             # Admin dashboard (builds to dist/)
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── package.json       # Root package.json (orchestrates all)
├── vercel.json        # Vercel configuration
├── render.yaml        # Render configuration
├── Procfile           # Heroku/traditional hosting
└── .env.example       # Environment variables template
```

---

## 🔵 Deployment on Vercel

### Prerequisites
- Vercel account (vercel.com)
- GitHub repository

### Step 1: Prepare Code
```bash
# Ensure all changes are committed
git add -A
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### Step 2: Deploy on Vercel
```bash
# Option A: Use Vercel CLI
npm i -g vercel
vercel

# Option B: Connect GitHub
# 1. Go to vercel.com
# 2. Click "New Project"
# 3. Import your GitHub repository
# 4. Select root directory
# 5. Click Deploy
```

### Step 3: Configure Environment Variables
```bash
# In Vercel Dashboard:
# 1. Go to Settings → Environment Variables
# 2. Add these variables:

NODE_ENV=production
PORT=3000
CORS_ORIGIN=your-vercel-domain.vercel.app
```

### Expected Result
- ✅ API runs at: `your-domain.vercel.app/api`
- ✅ Frontend runs at: `your-domain.vercel.app`
- ✅ Admin runs at: `your-domain.vercel.app/admin`
- ✅ Database: SQLite (persisted in memory/temp storage)

---

## 🟡 Deployment on Render

### Prerequisites
- Render account (render.com)
- GitHub repository

### Step 1: Connect Repository
```bash
# 1. Go to render.com
# 2. Click "New +" → "Web Service"
# 3. Connect your GitHub account
# 4. Select your repository
```

### Step 2: Configure Service
```
Build Command: npm run install:all && npm run build
Start Command: npm start
Environment: Node 18
Region: Choose closest to you
```

### Step 3: Add Environment Variables
```
NODE_ENV=production
PORT=3000
```

### Step 4: Deploy
```bash
# Render will automatically:
# 1. Install dependencies (all packages)
# 2. Build frontend & admin
# 3. Start backend server
```

---

## 🟣 Deployment on Heroku

### Prerequisites
- Heroku account (heroku.com)
- Heroku CLI installed

### Step 1: Prepare
```bash
# Login to Heroku
heroku login

# Create app
heroku create your-civicsense-app

# Set Node version
heroku buildpacks:set heroku/nodejs

# Add environment variables
heroku config:set NODE_ENV=production
heroku config:set PORT=3000
```

### Step 2: Deploy
```bash
git push heroku main
```

### Step 3: View Logs
```bash
heroku logs --tail
```

---

## 📋 Environment Variables (Production)

Create `.env` file in root directory:

```env
# Required
NODE_ENV=production
PORT=3000

# API Configuration
CORS_ORIGIN=your-production-domain.com

# Database (optional - defaults to SQLite)
DATABASE_URL=

# Admin
ADMIN_EMAIL=admin@civicsense.local
ADMIN_PASSWORD=admin123

# Features
ENABLE_SOS_MODE=true
ENABLE_GAMIFICATION=true
```

---

## 🔒 Security Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong `ADMIN_PASSWORD`
- [ ] Configure `CORS_ORIGIN` to your domain only
- [ ] Enable HTTPS (auto on Vercel/Render)
- [ ] Set secure database credentials if using external DB
- [ ] Use environment variables for all secrets
- [ ] Enable rate limiting on API endpoints
- [ ] Monitor application logs regularly

---

## 📊 Performance Optimization

### Built-in Optimizations
- ✅ Frontend: Vite builds with tree-shaking
- ✅ Backend: Express with compression middleware
- ✅ Admin: Lazy-loaded routes
- ✅ Database: SQLite with indexes
- ✅ Static files: Served directly from backend

### Further Optimization
```javascript
// Already configured in server.js:
- Static file caching
- GZIP compression
- CORS optimization
- Route-based static serving
```

---

## 🗄️ Database Notes

### SQLite (Default)
- **Pros**: No setup required, great for MVP
- **Cons**: Limited concurrent connections
- **File**: `backend/data/civicsense.db`
- **Auto-created**: On first run

### PostgreSQL (Recommended for Production)
```bash
# Install pg package
npm install pg

# Update backend/db.js to use PostgreSQL
# Set DATABASE_URL environment variable
```

---

## 📈 Scaling & Monitoring

### For Vercel
- Use Vercel Analytics
- Monitor bandwidth usage
- Set up error tracking (Sentry integration)

### For Render
- Use Render Dashboard
- View real-time logs
- Set up alerts

### For Heroku
```bash
# View metrics
heroku logs --tail
heroku ps

# Scale dynos
heroku ps:scale web=2
```

---

## 🔧 Troubleshooting

### Issue: "Cannot find module"
```bash
# Solution: Install all dependencies
npm run install:all
```

### Issue: Frontend not serving
```bash
# Check: vercel.json routes are correct
# Rebuild: npm run build:frontend
```

### Issue: Database not persisting
```bash
# Solution: Use external database (PostgreSQL/MongoDB)
# Add DATABASE_URL environment variable
```

### Issue: CORS errors
```bash
# Solution: Update CORS_ORIGIN environment variable
# Make sure domain matches exactly
```

---

## 📝 Deployment Checklist

- [ ] All code committed to main branch
- [ ] `.env` file created with production variables
- [ ] Vercel/Render account created
- [ ] Repository connected
- [ ] Environment variables set in dashboard
- [ ] Build command verified: `npm run build`
- [ ] Start command verified: `npm start`
- [ ] Deployed successfully
- [ ] All routes accessible (/, /api, /admin)
- [ ] Database initialized
- [ ] SSL certificate active
- [ ] Monitoring/logging configured

---

## 📚 Additional Resources

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **Heroku Docs**: https://devcenter.heroku.com
- **Express.js**: https://expressjs.com
- **Vite**: https://vitejs.dev

---

## 🎯 Key Points for Root Directory Hosting

1. **Single Entry Point**: Backend server (`backend/server.js`) serves everything
2. **Static Files**: Frontend builds copied and served as static files
3. **API Routes**: All API calls prefixed with `/api`
4. **SPA Fallback**: Unmatched routes fallback to `index.html`
5. **Environment-Based**: Behavior changes based on `NODE_ENV`

```javascript
// Simplified flow:
Request → Backend Server (port 3000)
    ├─ /api/* → API endpoints
    ├─ /admin/* → Admin dashboard
    └─ /* → Frontend SPA
```

---

## ✅ After Deployment

1. Test all endpoints:
   ```bash
   curl https://your-domain.vercel.app/health
   curl https://your-domain.vercel.app/api/leaderboard
   ```

2. Monitor logs for errors

3. Set up continuous deployment (auto-deploy on git push)

4. Configure custom domain (optional)

5. Enable CDN caching (for static assets)

---

**🚀 You're ready to deploy CivicSense!**
