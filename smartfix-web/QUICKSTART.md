# SmartFix Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Python 3.8+ (optional, for model inference)

### Directory Structure Overview
```
smartfix-web/
├── backend/           # API server (Express.js)
├── frontend/          # User website (React + Vite)
├── admin/             # Admin dashboard (React + Vite)
├── model/             # AI inference stub (Python)
├── docs/              # Documentation
├── .env.example       # Environment template
└── README.md          # Project overview
```

---

## 🔧 Installation & Setup

### Step 1: Clone/Extract Project
```bash
cd smartfix-web
```

### Step 2: Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Initialize database with seed data
npm run seed

# Start backend server
npm start
```
✅ Backend now running on **http://localhost:5000**

Admin credentials:
- Email: `admin@smartfix.local`
- Password: `admin123`

### Step 3: Frontend Setup (New Terminal)
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
✅ Frontend now running on **http://localhost:5173**

### Step 4: Admin Dashboard (New Terminal)
```bash
cd admin

# Install dependencies
npm install

# Start development server
npm run dev
```
✅ Admin running on **http://localhost:5174**

---

## 🎯 First Time Usage

### As a Citizen:
1. Open **http://localhost:5173** (Frontend)
2. Click "Report Issue"
3. Upload any image (try filename with "pothole" for demo)
4. Add description and location
5. Submit report
6. See your issue on the map!

### As a Verifier:
1. Go to "Map" page
2. Click on any issue marker
3. Click "Verify This Issue"
4. Gain +2 points!

### As a Volunteer:
1. Go to "Volunteer" page
2. Click "Claim This Issue"
3. You'll be assigned to fix it
4. Gain +20 points when resolved!

### As an Admin:
1. Open **http://localhost:5174** (Admin Dashboard)
2. Login with: `admin@smartfix.local` / `admin123`
3. View metrics, manage issues, export CSV

---

## 📱 Available Pages

### Frontend (Citizen View)
| URL | Purpose |
|-----|---------|
| `/` | Landing page with features |
| `/report` | Upload issue with AI detection |
| `/map` | View all issues on interactive map |
| `/issue/:id` | View issue details & verify |
| `/leaderboard` | Global user rankings |
| `/volunteer` | Claim issues as volunteer |

### Admin Dashboard
| URL | Purpose |
|-----|---------|
| `/` | Dashboard with metrics & charts |
| Issues Tab | Table view with filters & sorting |
| Map Tab | Heatmap visualization |

---

## 🧪 Testing the Backend

### Run Tests
```bash
cd backend
npm test
```

This runs Jest tests for:
- POST /api/report (create report)
- GET /api/reports (list all)
- GET /api/heatmap (heatmap data)
- POST /api/admin/login (authentication)

---

## 🔌 API Endpoints Quick Reference

### Public
```
POST   /api/infer                    # AI image classification
POST   /api/report                   # Create new report
GET    /api/reports                  # List all reports
GET    /api/reports/:id              # Get single report
POST   /api/report/:id/verify        # Verify issue
GET    /api/heatmap                  # Get heatmap data
GET    /api/leaderboard              # Get top 20 users
```

### Admin
```
POST   /api/admin/login              # Admin login
GET    /api/admin/metrics            # Dashboard metrics
POST   /api/admin/report/:id/status  # Update issue status
GET    /api/admin/exports/csv        # Export as CSV
POST   /api/volunteer/claim/:id      # Volunteer claim issue
```

---

## 🎮 Gamification Points

| Action | Points |
|--------|--------|
| Report Issue | +10 |
| Verify Issue | +2 |
| Resolve (Volunteer) | +20 |

View all points on `/leaderboard`

---

## 🗺️ Demo Data

The database is pre-seeded with:
- 5 sample civic issues (potholes, garbage, water leaks, etc.)
- 5 sample users with varying points
- 3 sample volunteers
- Random locations in Delhi, India

To reset data:
```bash
cd backend
npm run seed
```

---

## 🔑 Key Features Walkthrough

### Feature A: AI-Based Issue Detection
1. Upload a photo on `/report` page
2. Backend runs inference (stub or real model)
3. Returns: `{ label: "pothole", confidence: 0.92 }`
4. Severity auto-calculated: High (for potholes)
5. Department auto-routed: "R&B"

### Feature B: Severity Scoring
- **High**: Potholes, water leaks
- **Medium**: Garbage, streetlights, illegal dumping
- **Low**: Other issues

### Feature C: Heatmap
- Red circles = High severity, verified issues
- Orange = Medium severity
- Blue = Low severity
- Circle size = issue density + weight

### Feature D: Community Validation
- Users verify issues (click "Verify This Issue")
- At 3+ verifications → Issue marked VERIFIED
- Verifiers earn +2 points

### Feature E: Auto-Routing
Department assignment based on issue type:
- Pothole → R&B (Roads & Buildings)
- Garbage → Sanitation
- Water → Municipal Water
- Streetlight → Electrical
- Dumping → Sanitation

### Feature F: Volunteer Integration
- Volunteers claim open issues
- Update status: Open → In-progress → Resolved
- Earn +20 points when resolved

### Feature G: Gamification
- Leaderboard shows top 20 users by points
- Points earned for reporting, verifying, resolving
- Badges: "Civic Hero" (100+ pts), "Community Leader" (500+ pts)

### Feature H: Time-to-Resolve Prediction
Display estimated resolution time:
- High severity: 24-48 hours
- Medium severity: ~72 hours
- Low severity: 5-7 days

### Feature I: SOS/Emergency Reporting
1. Check "SOS / Emergency" checkbox on `/report`
2. Issue auto-marked as High severity
3. Auto-routes to Emergency Response dept
4. Gets highest priority

### Feature J: Anonymous Reporting
1. Check "Report Anonymously" on `/report`
2. Report submits without user ID
3. No user account needed
4. Still gets points (from anonymous pool)

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Backend won't start | Check port 5000 is available: `netstat -ano | findstr :5000` |
| Database error | Delete `backend/data/smartfix.db` and run `npm run seed` |
| Map not showing | Verify Leaflet CDN is accessible |
| Frontend/Admin can't reach API | Check backend is running on port 5000 |
| CORS errors | Verify backend has `cors()` middleware |

---

## 📦 Building for Production

### Frontend
```bash
cd frontend
npm run build
# Output: dist/
# Deploy to Vercel or Netlify
```

### Admin
```bash
cd admin
npm run build
# Output: dist/
# Deploy separately for access control
```

### Backend
```bash
cd backend
# Set NODE_ENV=production
# Migrate SQLite to PostgreSQL
# Deploy to Railway, Heroku, or AWS Lambda
```

---

## 🔐 Environment Variables

Create `.env` file in each directory:

**backend/.env**
```
BACKEND_PORT=5000
NODE_ENV=development
DATABASE_URL=./data/smartfix.db
```

**frontend/.env.local**
```
VITE_API_URL=http://localhost:5000
```

**admin/.env.local**
```
VITE_API_URL=http://localhost:5000
```

---

## 📚 Documentation Files

- **docs/architecture.md** - System design, data model, API reference
- **docs/pitch-deck.md** - 10-slide presentation
- **docs/demo-script.md** - 60-second live demo walkthrough

---

## 🚀 Next Steps

### Immediate (Hackathon)
- [x] Build MVP with all A-J features
- [x] Create responsive frontend
- [x] Build admin dashboard
- [x] Add documentation

### Short-term (Post-Hackathon)
- [ ] Integrate real ML model (TensorFlow/YOLO)
- [ ] Add WebSocket for real-time updates
- [ ] Implement email notifications
- [ ] Switch to PostgreSQL for scale

### Long-term (Production)
- [ ] Mobile app (React Native)
- [ ] Payment processing for volunteer rewards
- [ ] Municipal API integrations
- [ ] Multi-language support
- [ ] Computer vision for damage assessment

---

## 📞 Support & Contact

Built for National Hackathon 2025

For issues:
1. Check docs/ folder
2. Review backend logs
3. Verify all services are running
4. Check browser console for frontend errors

---

**Happy Hacking! 🚀**
