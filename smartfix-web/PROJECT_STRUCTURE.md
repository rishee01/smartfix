# 📁 SmartFix Project Structure Guide

## Overview
SmartFix is divided into **3 main parts**: Frontend, Backend, and Database

---

## 🎨 **PART 1: FRONTEND** (User Interface)
### Location: `frontend/` folder
### Purpose: What users see and interact with

```
frontend/
├── 📄 index.html                 ← Main webpage template
├── 📄 package.json               ← Frontend dependencies list
├── 🎨 tailwind.config.js         ← Styling configuration
├── ⚙️ vite.config.js             ← Build tool configuration
│
├── src/                          ← Source code
│   ├── 📄 main.jsx              ← Application entry point
│   ├── 📄 App.jsx               ← Main app component & routing
│   ├── 📄 index.css             ← Global styles
│   │
│   ├── components/              ← Reusable UI components
│   │   └── 📄 Navbar.jsx        ← Navigation bar
│   │
│   └── pages/                   ← Full pages (screens users see)
│       ├── 📄 Landing.jsx       ← Home/Welcome page
│       ├── 📄 ReportIssue.jsx   ← 📸 Report issue page (Photo upload)
│       ├── 📄 MapView.jsx       ← 🗺️ Issue map with heatmap
│       ├── 📄 IssueDetail.jsx   ← 📋 Single issue details
│       ├── 📄 Leaderboard.jsx   ← 🏆 Top users ranking
│       └── 📄 VolunteerPage.jsx ← 👥 Volunteer dashboard
```

### What Users See:
1. **Landing Page** (`Landing.jsx`) - Welcome screen
2. **Report Issue** (`ReportIssue.jsx`) - Upload photo & describe problem
3. **Map View** (`MapView.jsx`) - See all issues on map
4. **Issue Detail** (`IssueDetail.jsx`) - Read full details & verify
5. **Leaderboard** (`Leaderboard.jsx`) - See top contributors
6. **Volunteer** (`VolunteerPage.jsx`) - Volunteer dashboard

---

## 🔧 **PART 2: BACKEND** (Business Logic & API)
### Location: `backend/` folder
### Purpose: Server logic, calculations, data processing

```
backend/
├── 📄 server.js                 ← Main server file (starts backend)
├── 📄 package.json              ← Backend dependencies list
├── 📄 db.js                     ← Database connection setup
├── 📄 models.js                 ← Data models & calculations
├── 📄 routes.js                 ← API endpoints (all request handlers)
├── 📄 seed.js                   ← Sample data generator
│
├── data/                        ← Stores uploaded images
│   └── (image files go here)
│
├── uploads/                     ← User-uploaded photos
│   └── (user photos go here)
│
├── __tests__/                   ← Test files
│   └── 📄 api.test.js          ← API testing
│
└── Dockerfile                   ← Docker container setup
```

### What Backend Does:
- Processes photo uploads
- Runs AI analysis on images
- Calculates severity scores
- Routes issues to departments
- Tracks user points & rankings
- Handles verification system
- Stores all data in database

---

## 💾 **PART 3: DATABASE** (Data Storage)
### Location: `backend/db.js` & SQLite file
### Purpose: Stores all information

```
DATABASE TABLES (What information is stored):

📊 REPORTS TABLE
├── ID (unique issue number)
├── Photo URL (image location)
├── Description (what's wrong)
├── Latitude & Longitude (where)
├── Label (issue type: pothole, garbage, etc.)
├── Confidence (AI certainty %)
├── Severity (Critical/High/Medium/Low)
├── Department (which agency handles it)
├── Verified Count (how many people verified)
├── Status (Open/In-progress/Resolved)
├── Is SOS (emergency flag)
└── Timestamps (when created/updated)

👤 USERS TABLE
├── ID (user number)
├── Name (user's name)
├── Email (contact)
├── Points (reward score)
└── Created Date

🤝 VOLUNTEERS TABLE
├── ID (volunteer number)
├── Name (volunteer name)
├── Claimed Issues Count (how many taken on)
├── Resolved Count (how many fixed)
└── Joined Date

✓ VERIFICATIONS TABLE
├── ID (verification number)
├── Report ID (which issue verified)
├── User ID (who verified)
└── Created Date

🔐 ADMIN USERS TABLE
├── ID (admin number)
├── Email (login)
├── Password (access)
└── Created Date
```

---

## 📊 How They Work Together

```
USER ACTION → FRONTEND → BACKEND → DATABASE → FRONTEND (shows result)

Example: User reports an issue
1. User opens ReportIssue.jsx (FRONTEND)
2. Clicks "Upload Photo"
3. Frontend sends photo to /api/report (BACKEND)
4. Backend analyzes with AI
5. Backend calculates severity
6. Backend saves to DATABASE
7. Frontend shows success message
8. New issue appears on MapView.jsx
```

---

## 🎯 Quick File Reference

### For REPORTING an issue:
- **Frontend:** `frontend/src/pages/ReportIssue.jsx`
- **Backend:** `backend/routes.js` → POST `/api/report`
- **Database:** `reports` table

### For VIEWING issues:
- **Frontend:** `frontend/src/pages/MapView.jsx`
- **Backend:** `backend/routes.js` → GET `/api/reports` & GET `/api/heatmap`
- **Database:** `reports` table

### For VERIFYING issues:
- **Frontend:** `frontend/src/pages/IssueDetail.jsx`
- **Backend:** `backend/routes.js` → POST `/api/report/:id/verify`
- **Database:** `verifications` table + `reports` table (verified_count)

### For LEADERBOARD:
- **Frontend:** `frontend/src/pages/Leaderboard.jsx`
- **Backend:** `backend/routes.js` → GET `/api/leaderboard`
- **Database:** `users` table

### For VOLUNTEER work:
- **Frontend:** `frontend/src/pages/VolunteerPage.jsx`
- **Backend:** `backend/routes.js` → POST `/api/volunteer/claim/:id`
- **Database:** `volunteers` table + `reports` table (status)

---

## 🚀 Starting Each Part

### Start BACKEND:
```
cd backend
npm install
npm run seed
npm start
```
Backend runs on: **http://localhost:3000**

### Start FRONTEND:
```
cd frontend
npm install
npm run dev
```
Frontend runs on: **http://localhost:5173**

### DATABASE:
- Automatically created in `backend/` folder
- Data persists even after server restarts
- Can be reset with `npm run seed`

---

## 📱 User Flow Through Parts

```
SCREEN 1: Landing Page (frontend/pages/Landing.jsx)
   ↓
SCREEN 2: Report Issue (frontend/pages/ReportIssue.jsx)
   → Upload photo → Backend analyzes → Shows AI result
   ↓
SCREEN 3: Map View (frontend/pages/MapView.jsx)
   → Backend gets all issues → Shows on map with colors
   ↓
SCREEN 4: Issue Detail (frontend/pages/IssueDetail.jsx)
   → Backend gets single issue → Shows full info
   → User clicks "Verify" → Backend adds to database
   ↓
SCREEN 5: Leaderboard (frontend/pages/Leaderboard.jsx)
   → Backend calculates points → Shows rankings
```

---

## 🎓 Understanding Connections

| Action | Frontend File | Backend File | Database Table |
|--------|---------------|--------------|----------------|
| Report Issue | ReportIssue.jsx | routes.js `/api/report` | reports |
| View Map | MapView.jsx | routes.js `/api/reports` | reports |
| Verify Issue | IssueDetail.jsx | routes.js `/api/report/:id/verify` | verifications |
| View Leaderboard | Leaderboard.jsx | routes.js `/api/leaderboard` | users |
| Volunteer Claim | VolunteerPage.jsx | routes.js `/api/volunteer/claim/:id` | volunteers |

---

## 💡 Key Concepts

### Frontend = What You See
- Beautiful buttons and screens
- User interactions (click, type, upload)
- Displays data received from backend

### Backend = Brain
- Does all calculations
- Checks if data is correct
- Saves data to database
- Sends data to frontend

### Database = Memory
- Stores all information
- Never forgets data
- Can be queried (searched) by backend
- Multiple users share same database

---

**Now you can easily understand where each part is and what it does!** 🎉
