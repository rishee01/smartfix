# 🎨 SmartFix Project - Visual Guide for Beginners

## The 3 Main Parts Explained Simply

---

## 1️⃣ **FRONTEND** 🎨
### What is it? The app you see on your phone/computer

```
📱 What Users See:

┌─────────────────────────────────┐
│  🏠 HOME PAGE                   │
│  Welcome to SmartFix!           │
│  [Report Issue] [View Map]      │
└─────────────────────────────────┘
         ↓ User clicks "Report Issue"
┌─────────────────────────────────┐
│  📸 REPORT ISSUE PAGE           │
│  [Choose Photo]                 │
│  AI Says: "Pothole detected"    │
│  [Submit Report]                │
└─────────────────────────────────┘
         ↓ User clicks "Submit"
┌─────────────────────────────────┐
│  🗺️ MAP PAGE                    │
│  See all issues on map          │
│  [Click issue] → Details        │
└─────────────────────────────────┘
```

### Files Location:
```
frontend/src/pages/
├── Landing.jsx        ← Home page
├── ReportIssue.jsx    ← Photo upload
├── MapView.jsx        ← Map with issues
├── IssueDetail.jsx    ← Issue details
├── Leaderboard.jsx    ← Top users
└── VolunteerPage.jsx  ← Volunteer work
```

### What to Know:
- ✅ This is what users interact with
- ✅ Built with React (JavaScript)
- ✅ Uses Tailwind CSS for styling
- ✅ Sends requests to Backend when user clicks buttons

---

## 2️⃣ **BACKEND** ⚙️
### What is it? The server brain that makes decisions

```
What Backend Does:

User uploads photo
        ↓
Backend receives photo
        ↓
Backend runs AI analysis
        ↓
Backend calculates severity
        ↓
Backend stores in database
        ↓
Backend sends result back to Frontend
        ↓
User sees result on screen
```

### Files Location:
```
backend/
├── server.js      ← Server starts here
├── routes.js      ← What the server can do
├── models.js      ← Calculations & logic
├── db.js          ← Database connection
└── seed.js        ← Sample data
```

### Main Calculations in Backend:

```
Severity Score Calculation:
┌──────────────────────────────────┐
│ Base Severity (1-10)             │
│ × AI Confidence (0.8-1.5x)       │
│ + Community Verifications (+0.5) │
│ × SOS Emergency (2.5x if yes)    │
└──────────────────────────────────┘
     = FINAL SEVERITY
```

### What to Know:
- ✅ Runs on a server (Node.js)
- ✅ Listens for requests from Frontend
- ✅ Processes all calculations
- ✅ Talks to Database to save/load data
- ✅ Sends responses back to Frontend

---

## 3️⃣ **DATABASE** 💾
### What is it? The filing cabinet that stores everything

```
Database is like a library with tables:

┌─ REPORTS TABLE ────────────────────┐
│ ID | Photo | Location | Severity   │
│ 1  | img1  | 28.6°N   | High       │
│ 2  | img2  | 28.7°N   | Critical   │
│ 3  | img3  | 28.5°N   | Medium     │
└────────────────────────────────────┘

┌─ USERS TABLE ──────────────────────┐
│ ID | Name      | Points | Status   │
│ 1  | John      | 150    | Active   │
│ 2  | Sarah     | 230    | Active   │
│ 3  | Mike      | 85     | Active   │
└────────────────────────────────────┘

┌─ VOLUNTEERS TABLE ─────────────────┐
│ ID | Name      | Claims | Resolved │
│ 1  | NGO Team  | 12     | 8        │
│ 2  | Charity   | 7      | 5        │
└────────────────────────────────────┘
```

### Files Location:
```
backend/
└── smartfix.db     ← This file stores everything
```

### What to Know:
- ✅ Stores ALL information (issues, users, points, etc.)
- ✅ Created automatically when backend starts
- ✅ Backend queries it to get/save data
- ✅ Data persists (doesn't disappear when you restart)

---

## 🔄 How They Work Together

### Example: User Reports an Issue

```
STEP 1: USER OPENS FRONTEND
┌─────────────────────────────────────┐
│ 🌐 Browser: localhost:5173          │
│ 📱 Shows: Report Issue Page         │
│ User clicks: "Choose Photo"         │
└─────────────────────────────────────┘
        ↓
        FRONTEND sends photo request to BACKEND

STEP 2: BACKEND PROCESSES
┌─────────────────────────────────────┐
│ ⚙️ Server: localhost:3000           │
│ AI analyzes photo → "Pothole"       │
│ Calculates severity → "High"        │
│ Prepares to save data               │
└─────────────────────────────────────┘
        ↓
        BACKEND saves to DATABASE

STEP 3: DATABASE STORES
┌─────────────────────────────────────┐
│ 💾 File: smartfix.db                │
│ New row added to REPORTS table      │
│ Contains: photo, location, severity │
│ Status: Saved successfully          │
└─────────────────────────────────────┘
        ↓
        BACKEND sends confirmation to FRONTEND

STEP 4: USER SEES RESULT
┌─────────────────────────────────────┐
│ 🌐 Browser: localhost:5173          │
│ Shows: "✅ Issue reported!"         │
│ Shows: "Severity: High"             │
│ Shows: "+10 points earned"          │
└─────────────────────────────────────┘
```

---

## 📊 What Each Part Stores/Shows

### Frontend Stores:
- ❌ Nothing permanent
- ✅ Temporary data while user is using app
- ✅ Shows results from Backend

### Backend Processes:
- ✅ Calculations (severity, points, etc.)
- ✅ Receives requests from Frontend
- ✅ Queries Database
- ✅ Sends responses to Frontend

### Database Stores:
- ✅ All user reports
- ✅ User points & rankings
- ✅ Verification counts
- ✅ Photo locations
- ✅ Everything permanent

---

## 🎯 Finding Things in Code

### Q: "Where do users upload photos?"
**A:** Frontend → `frontend/src/pages/ReportIssue.jsx`

### Q: "Where is the code that analyzes photos?"
**A:** Backend → `backend/routes.js` (look for `/api/infer`)

### Q: "Where does it calculate severity?"
**A:** Backend → `backend/models.js` (look for `calculateAdvancedSeverity`)

### Q: "Where is the user points stored?"
**A:** Database → `backend/smartfix.db` (USERS table)

### Q: "Where are all the issues stored?"
**A:** Database → `backend/smartfix.db` (REPORTS table)

### Q: "Where is the leaderboard code?"
**A:** Frontend → `frontend/src/pages/Leaderboard.jsx`

---

## 📚 File Types Explained

```
.jsx files = React code (Frontend pages & components)
.js files = JavaScript code (Backend & logic)
.css files = Styling (how things look)
.json files = Configuration (settings & packages)
.py files = Python (AI models)
.db files = Database (data storage)
.html files = Web pages (templates)
.yml files = Docker setup (containers)
```

---

## 🚀 Starting the App - Simple Steps

### Terminal 1 (Backend Server):
```bash
cd backend          ← Go to backend folder
npm install         ← Install packages (1st time only)
npm run seed        ← Create sample data
npm start           ← Start server (opens port 3000)
```

### Terminal 2 (Frontend App):
```bash
cd frontend         ← Go to frontend folder
npm install         ← Install packages (1st time only)
npm run dev         ← Start frontend (opens port 5173)
```

### Open Browser:
```
http://localhost:5173/     ← This is your app!
```

---

## 💡 Remember These 3 Parts

```
┌──────────────────────────────────────────┐
│ 🎨 FRONTEND = What you see & click       │
│ Location: frontend/ folder               │
│ Built with: React, JavaScript, Tailwind  │
│ Runs on: Port 5173                       │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│ ⚙️ BACKEND = Server that thinks          │
│ Location: backend/ folder                │
│ Built with: Node.js, Express, JavaScript │
│ Runs on: Port 3000                       │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│ 💾 DATABASE = Memory that saves          │
│ Location: backend/smartfix.db            │
│ Type: SQLite                             │
│ Stores: Issues, Users, Points, Photos    │
└──────────────────────────────────────────┘
```

---

**That's it! You now understand the full structure! 🎉**

Next step: Open `QUICKSTART.md` to learn how to run it!
