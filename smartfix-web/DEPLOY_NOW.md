# 🚀 CivicSense - Quick Deployment Guide

## Deploy in 5 Minutes

### Option 1: Deploy to Vercel (Recommended)

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy
cd smartfix-web
vercel

# 3. Set environment (select production)
# Vercel will automatically:
# - Build frontend (Vite)
# - Build admin dashboard (Vite)
# - Deploy backend + API
# - Serve everything from one domain

# ✅ Your app is live at: your-project.vercel.app
```

**Environment Variables (set in Vercel Dashboard):**
```
NODE_ENV=production
PORT=3000
```

---

### Option 2: Deploy to Render

```bash
# 1. Go to render.com and sign up

# 2. Click "New +" → "Web Service"

# 3. Connect GitHub repository

# 4. Configure:
Build Command:  npm run install:all && npm run build
Start Command:  npm start
Environment:    Node 18
Region:         Choose closest to you

# 5. Click Deploy

# ✅ Your app is live automatically
```

---

### Option 3: Deploy to Heroku

```bash
# 1. Install Heroku CLI
# Download from: https://devcenter.heroku.com/articles/heroku-cli

# 2. Login and create app
heroku login
heroku create your-civicsense-app

# 3. Deploy
git push heroku main

# 4. View logs
heroku logs --tail

# ✅ Your app is live at: your-civicsense-app.herokuapp.com
```

---

## What Happens During Deployment

1. **Install Dependencies**
   ```
   backend/ → npm install
   frontend/ → npm install
   admin/ → npm install
   ```

2. **Build Projects**
   ```
   frontend/ → npm run build → frontend/dist/
   admin/ → npm run build → admin/dist/
   ```

3. **Start Backend Server**
   ```
   backend/server.js starts on PORT 3000
   Serves:
   - /api/* → API endpoints
   - /admin/* → Admin dashboard (from admin/dist/)
   - /* → Frontend (from frontend/dist/)
   ```

4. **Database Initialization**
   ```
   Creates: backend/data/civicsense.db
   Auto-seeds with sample data
   ```

---

## Project Layout After Deployment

```
https://your-domain.com/
├── /                    → Frontend (React SPA)
├── /admin               → Admin Dashboard
├── /api/report          → API endpoints
├── /api/reports         → Fetch issues
├── /api/leaderboard     → User rankings
└── /api/infer          → AI image classification
```

---

## Environment Variables

**Required:**
```env
NODE_ENV=production
PORT=3000
```

**Optional:**
```env
CORS_ORIGIN=your-domain.com
ADMIN_EMAIL=admin@civicsense.local
ADMIN_PASSWORD=admin123
ENABLE_SOS_MODE=true
ENABLE_GAMIFICATION=true
```

---

## Testing Your Deployment

```bash
# Test API health
curl https://your-domain.com/health

# Test frontend loads
curl https://your-domain.com/

# Test API endpoints
curl https://your-domain.com/api/leaderboard
curl https://your-domain.com/api/reports
```

---

## Deployment Checklist

- [ ] All code committed to `main` branch
- [ ] Choose hosting platform (Vercel/Render/Heroku)
- [ ] Connect GitHub repository
- [ ] Set environment variables
- [ ] Click Deploy
- [ ] Test all routes (/, /admin, /api)
- [ ] Verify database is working
- [ ] Monitor logs for errors

---

## Common Issues & Solutions

**Problem: "Cannot find module"**
```
Solution: npm run install:all
```

**Problem: Frontend not loading**
```
Solution: Check build succeeded (npm run build:frontend)
```

**Problem: API returns 404**
```
Solution: Make sure routes use /api prefix
```

**Problem: Database errors**
```
Solution: Check backend logs, ensure data/ directory exists
```

---

## After Deployment

### Enable Auto-Deployment (Vercel/Render)
- ✅ Any `git push` automatically deploys
- ✅ No manual steps needed
- ✅ Logs available in dashboard

### Set Custom Domain
1. Buy domain (GoDaddy, Namecheap, etc.)
2. Point DNS to hosting provider
3. Enable HTTPS (automatic)

### Monitor Performance
- Vercel: vercel.com/dashboard
- Render: render.com/dashboard
- Heroku: heroku apps:info

---

## Database Notes

**SQLite (Current Setup)**
- Good for MVP/testing
- Data stored in `backend/data/civicsense.db`
- Limited concurrent users (~10)

**PostgreSQL (Production Recommended)**
```bash
# Create PostgreSQL database
# Set environment variable:
DATABASE_URL=postgresql://user:password@host/db

# Backend will auto-connect
```

---

## Rollback Deployment

**Vercel:**
```
Go to Dashboard → Deployments → Previous version → Promote
```

**Render:**
```
Go to Dashboard → Deployments → Click previous → Redeploy
```

**Heroku:**
```bash
heroku releases
heroku rollback
```

---

## Production Optimization

### Already Configured
- ✅ Minified builds (Terser)
- ✅ Tree-shaking (Vite)
- ✅ Gzip compression
- ✅ Static file caching
- ✅ SPA routing

### Additional (Optional)
- Add CDN for static files
- Enable Cloudflare
- Set up monitoring (Sentry)
- Add analytics (Vercel Analytics)

---

## Support Commands

```bash
# Install all dependencies
npm run install:all

# Build everything
npm run build

# Run locally
npm start

# Development mode
npm run dev

# Seed database
npm run seed

# Run tests
npm run test
```

---

**🎉 You're ready to deploy CivicSense!**

Choose your platform above and follow the steps. The entire process takes ~5 minutes.

Questions? Check [DEPLOYMENT.md](DEPLOYMENT.md) for detailed guide.
