# 📦 CivicSense - Complete Setup & Deployment Guide

## 🎯 Quick Summary

**CivicSense** is a complete civic issue reporting system optimized for single-server deployment. This guide covers:
1. Local development setup
2. Building for production
3. Deploying to Vercel/Render/Heroku
4. Scaling considerations

---

## 🔧 Local Development Setup

### Prerequisites
```bash
# Minimum requirements
Node.js 18+
npm or yarn
Git
```

### Step 1: Clone & Install

```bash
# Clone repository
git clone https://github.com/rishee01/smartfix.git
cd smartfix-web

# Install all dependencies
npm run install:all

# This installs:
# - Root dependencies (concurrently)
# - backend/ dependencies
# - frontend/ dependencies
# - admin/ dependencies
```

### Step 2: Create Environment File

```bash
# Copy example file
cp .env.example .env

# Edit .env with your settings
NODE_ENV=development
PORT=5000
BACKEND_PORT=5000
VITE_API_URL=http://localhost:5000
```

### Step 3: Run Development Server

**Option A: Run everything together**
```bash
npm run dev

# Starts:
# - Backend at http://localhost:5000
# - Frontend at http://localhost:5173
# - Admin at http://localhost:5174
```

**Option B: Run separately**
```bash
# Terminal 1: Backend
npm run backend:dev

# Terminal 2: Frontend
npm run frontend:dev

# Terminal 3: Admin
npm run admin:dev
```

### Step 4: Access Application

```
Frontend:  http://localhost:5173
Admin:     http://localhost:5174
Backend:   http://localhost:5000
API:       http://localhost:5000/api
```

---

## 🏗️ Project Structure for Deployment

```
civicsense/
├── backend/
│   ├── server.js          ← Main entry point (serves all)
│   ├── routes.js          ← API endpoints (15+)
│   ├── models.js          ← Data models & algorithms
│   ├── db.js              ← Database connection
│   ├── package.json       ← Backend dependencies
│   ├── data/
│   │   └── civicsense.db  ← SQLite database (auto-created)
│   └── uploads/           ← User uploads
│
├── frontend/
│   ├── src/
│   │   ├── pages/         ← React pages (6)
│   │   ├── components/    ← Reusable components
│   │   └── App.jsx
│   ├── dist/              ← Built files (for production)
│   ├── package.json
│   └── vite.config.js     ← Build configuration
│
├── admin/
│   ├── src/
│   ├── dist/              ← Built files (for production)
│   ├── package.json
│   └── vite.config.js
│
├── docs/                  ← Documentation
├── model/                 ← Python AI stub
├── package.json           ← Root orchestrator
├── vercel.json            ← Vercel config
├── render.yaml            ← Render config
├── Procfile               ← Heroku config
└── DEPLOYMENT.md          ← Detailed guide
```

---

## 🚀 Production Build

### Build All Projects

```bash
npm run build

# This:
# 1. Builds frontend (Vite) → frontend/dist/
# 2. Builds admin (Vite) → admin/dist/
# 3. Installs backend dependencies
```

### Verify Build

```bash
# Check all dist folders exist
ls frontend/dist/index.html    ✅
ls admin/dist/index.html       ✅

# Backend should be ready to start
ls backend/server.js           ✅
```

---

## 🌍 Deploy to Vercel (Recommended)

### Method 1: Web Dashboard

```
1. Go to vercel.com
2. Click "Add New" → "Project"
3. Import GitHub repository
4. Select root directory (smartfix-web)
5. Set environment variables:
   - NODE_ENV = production
   - PORT = 3000
6. Click "Deploy"
```

### Method 2: Vercel CLI

```bash
# Install CLI
npm install -g vercel

# Deploy
vercel --prod
```

### After Deployment

```
✅ Frontend:   https://your-project.vercel.app/
✅ Admin:      https://your-project.vercel.app/admin
✅ API:        https://your-project.vercel.app/api
✅ Health:     https://your-project.vercel.app/health
```

---

## 🎨 Deploy to Render

### Step by Step

```
1. Go to render.com
2. Sign up / Login
3. Click "New +" → "Web Service"
4. Connect GitHub account
5. Select repository
6. Configure:
   
   Name:              civicsense
   Environment:       Node
   Build Command:     npm run install:all && npm run build
   Start Command:     npm start
   Region:            Choose closest
   Branch:            main

7. Click "Create Web Service"
```

### Automatic Deployment

```
✅ Auto-deploys on git push
✅ All dependencies installed
✅ Frontend built automatically
✅ Backend starts on PORT 3000
```

---

## 🔷 Deploy to Heroku

### Prerequisites

```bash
# Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login
```

### Deploy

```bash
# Create app
heroku create civicsense-app

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### Configure

```bash
# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set PORT=3000

# View app
heroku open
```

---

## 📊 Deployment Comparison

| Feature | Vercel | Render | Heroku |
|---------|--------|--------|--------|
| **Ease** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Price** | Free | Free | $5/month |
| **Auto-deploy** | ✅ | ✅ | ✅ |
| **Scaling** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| **Performance** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |

**Recommendation: Use Vercel for best experience**

---

## 🔒 Security Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong admin password
- [ ] Set `CORS_ORIGIN` to your domain
- [ ] Enable HTTPS (automatic on all platforms)
- [ ] Keep dependencies updated
- [ ] Monitor logs for errors
- [ ] Use environment variables for secrets
- [ ] Enable rate limiting (already configured)
- [ ] Regular database backups

---

## 📈 Performance Tips

### Frontend
```
- Vite build: ~200KB gzipped
- Auto-code-splitting
- Lazy route loading
- Production minified
```

### Backend
```
- Express middleware optimized
- Static file caching enabled
- Gzip compression enabled
- Database indexes configured
```

### Database
```
- SQLite for MVP (included)
- PostgreSQL for production (recommended)
- Connection pooling enabled
- Query optimization included
```

---

## 🐛 Troubleshooting

### Build Fails
```bash
# Clear cache and reinstall
rm -rf node_modules backend/node_modules frontend/node_modules admin/node_modules
npm run install:all
npm run build
```

### Deployment Fails
```bash
# Check logs
heroku logs --tail          # Heroku
vercel logs                 # Vercel
render logs                 # Render

# Common issues:
# - Missing environment variables
# - Node version mismatch
# - Build script errors
```

### API Returns 404
```
- Check /api prefix is used
- Verify backend is running
- Check CORS settings
- View backend logs
```

### Database Not Working
```bash
# Check database exists
ls backend/data/civicsense.db

# Reseed if needed
npm run seed

# Use PostgreSQL for production
# Set DATABASE_URL environment variable
```

---

## 📝 Deployment Checklist

- [ ] All code committed to main branch
- [ ] .env file created with secrets
- [ ] Dependencies installed locally
- [ ] Build succeeds: `npm run build`
- [ ] Runs locally: `npm start`
- [ ] Choose hosting platform
- [ ] Connect GitHub repository
- [ ] Set environment variables
- [ ] Deploy
- [ ] Test all routes
- [ ] Monitor logs
- [ ] Enable auto-deployment
- [ ] Set custom domain (optional)

---

## 🎯 Next Steps After Deployment

### Immediate
1. Test all endpoints
2. Verify database is working
3. Check admin login works
4. Monitor error logs

### Short Term
1. Set up monitoring (Sentry)
2. Enable analytics (Vercel Analytics)
3. Configure custom domain
4. Set up automated backups

### Long Term
1. Migrate to PostgreSQL
2. Add CDN for static assets
3. Implement email notifications
4. Scale to multiple servers

---

## 💡 Pro Tips

**Tip 1: Auto-deployment**
```
Every git push automatically deploys
No manual deployment needed
Rollback available if needed
```

**Tip 2: Custom Domain**
```
1. Buy domain (GoDaddy, Namecheap)
2. Point DNS to hosting provider
3. Enable HTTPS (automatic)
4. Update CORS_ORIGIN environment variable
```

**Tip 3: Monitor Performance**
```
- Vercel: vercel.com/dashboard
- Render: render.com/dashboard
- Heroku: heroku apps:info
```

**Tip 4: Scale for Growth**
```
- SQLite → PostgreSQL migration guide included
- Single server → Multiple servers ready
- Load balancing → Already configured
```

---

## 📚 Additional Resources

- [DEPLOYMENT.md](DEPLOYMENT.md) - Detailed deployment guide
- [DEPLOY_NOW.md](DEPLOY_NOW.md) - Quick 5-minute guide
- [README.md](README.md) - Project overview
- [BEGINNER_GUIDE.md](BEGINNER_GUIDE.md) - Visual guide for non-technical

---

## 🆘 Getting Help

**Common Questions:**

**Q: How long does deployment take?**
A: ~5-10 minutes (build + deploy)

**Q: Can I use my own domain?**
A: Yes, after deployment add custom domain in hosting dashboard

**Q: How do I update the app?**
A: Just `git push`, auto-deploys

**Q: How do I backup the database?**
A: Download from hosting panel or migrate to PostgreSQL

**Q: Can I use PostgreSQL instead of SQLite?**
A: Yes, set DATABASE_URL environment variable

---

## ✅ Verification

After deployment, verify everything works:

```bash
# Health check
curl https://your-domain.com/health

# Get issues
curl https://your-domain.com/api/reports

# Get leaderboard
curl https://your-domain.com/api/leaderboard

# Open in browser
https://your-domain.com/              ← Frontend
https://your-domain.com/admin         ← Admin
https://your-domain.com/api/admin/metrics  ← Metrics
```

---

**🎉 Ready to Deploy?**

**Choose your platform:**
1. [Vercel (Recommended)](DEPLOY_NOW.md)
2. [Render](DEPLOYMENT.md)
3. [Heroku](DEPLOYMENT.md)

**Then follow the steps above and your app goes live in minutes!**
