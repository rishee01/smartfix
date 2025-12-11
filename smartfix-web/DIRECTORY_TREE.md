# 📂 CivicSense Complete Directory Tree

```
smartfix-web/
│
├── 📋 README.md                          ← Project overview
├── 📋 QUICKSTART.md                      ← How to start
├── 📋 PROJECT_SUMMARY.md                 ← Project details
├── 📋 DELIVERY_CHECKLIST.md              ← What's completed
├── 📋 START_HERE.md                      ← Read this first!
├── 📋 INDEX.md                           ← File index
├── 📋 OPTIMIZATION_SUMMARY.md            ← Feature optimizations
├── 📋 FEATURE_CHECKLIST.md               ← All 10+ features
├── 📋 PROJECT_STRUCTURE.md               ← THIS FILE ← Read for overview!
│
├── 🐳 docker-compose.yml                 ← Docker setup
├── 🐚 setup.sh                           ← Linux/Mac setup script
├── 🪟 setup.bat                          ← Windows setup script
│
│
│ ═══════════════════════════════════════════════════════════════
│ 🎨 PART 1: FRONTEND (What Users See)
│ ═══════════════════════════════════════════════════════════════
│
├── frontend/
│   ├── 📋 README.md
│   ├── 📋 package.json                   ← Frontend packages list
│   ├── 📄 index.html                     ← Main webpage
│   │
│   ├── 🎨 tailwind.config.js             ← Styling setup
│   ├── 🎨 postcss.config.js              ← CSS processor
│   ├── ⚙️ vite.config.js                 ← Build tool
│   │
│   └── src/
│       ├── 📄 main.jsx                   ← Starts the app
│       ├── 📄 App.jsx                    ← Main routing/navigation
│       ├── 🎨 index.css                  ← Global styles
│       │
│       ├── components/
│       │   └── 📄 Navbar.jsx             ← Navigation menu
│       │
│       └── pages/
│           ├── 📱 Landing.jsx            ← 🏠 Home page
│           ├── 📸 ReportIssue.jsx        ← 📸 UPLOAD PHOTO HERE
│           ├── 🗺️ MapView.jsx            ← 🗺️ See all issues on map
│           ├── 📋 IssueDetail.jsx        ← 📋 Single issue details
│           ├── 🏆 Leaderboard.jsx        ← 🏆 Top users ranking
│           └── 👥 VolunteerPage.jsx      ← 👥 Volunteer work
│
│
│ ═══════════════════════════════════════════════════════════════
│ 🔧 PART 2: BACKEND (Server Logic)
│ ═══════════════════════════════════════════════════════════════
│
├── backend/
│   ├── 📋 README.md
│   ├── 📋 package.json                   ← Backend packages list
│   │
│   ├── ⚙️ server.js                      ← Main server file (START HERE)
│   ├── 🔌 db.js                          ← Database connection
│   ├── 📊 models.js                      ← Calculations & algorithms
│   ├── 🛣️ routes.js                      ← All API endpoints
│   ├── 🌱 seed.js                        ← Sample data maker
│   ├── 🧪 jest.config.js                 ← Testing setup
│   │
│   ├── 🐳 Dockerfile                     ← Container setup
│   │
│   ├── 📁 data/                          ← Sample images
│   ├── 📁 uploads/                       ← User uploaded photos
│   │
│   ├── __tests__/
│   │   └── 🧪 api.test.js               ← API tests
│   │
│   └── (database file created here when running)
│
│
│ ═══════════════════════════════════════════════════════════════
│ 💾 PART 3: DATABASE (Data Storage)
│ ═══════════════════════════════════════════════════════════════
│
│ Located in: backend/smartfix.db (SQLite database)
│ Tables stored:
│ ├── reports          ← All civic issues
│ ├── users            ← Community members & points
│ ├── volunteers       ← NGO workers
│ ├── verifications    ← Issue confirmations
│ └── admin_users      ← Admin accounts
│
│
│ ═══════════════════════════════════════════════════════════════
│ 📚 PART 4: DOCUMENTATION & EXTRAS
│ ═══════════════════════════════════════════════════════════════
│
├── docs/
│   ├── 📄 architecture.md                ← System design
│   ├── 📄 demo-script.md                 ← How to demo
│   └── 📄 pitch-deck.md                  ← Presentation
│
├── model/
│   ├── 📄 README.md
│   ├── 🐍 infer_stub.py                  ← AI model placeholder
│   └── (AI integration point)
│
├── admin/
│   ├── 📋 package.json                   ← Admin panel packages
│   ├── 📄 index.html                     ← Admin webpage
│   │
│   ├── 🎨 tailwind.config.js
│   ├── 🎨 postcss.config.js
│   ├── ⚙️ vite.config.js
│   │
│   └── src/
│       ├── 📄 main.jsx
│       ├── 📄 App.jsx
│       ├── 🎨 index.css
│       │
│       └── pages/
│           ├── 📊 Dashboard.jsx          ← Admin statistics
│           ├── 📋 IssuesTable.jsx        ← All issues list
│           ├── 🗺️ MapView.jsx            ← Admin map view
│           └── 🔐 Login.jsx              ← Admin login
│
└── (root level)
    └── Various config & doc files
```

---

## 📍 Where to Find What You Need

### Want to Upload a Photo? 📸
→ `frontend/src/pages/ReportIssue.jsx`

### Want to See All Issues on Map? 🗺️
→ `frontend/src/pages/MapView.jsx`

### Want to See User Rankings? 🏆
→ `frontend/src/pages/Leaderboard.jsx`

### Want to Check Issue Details? 📋
→ `frontend/src/pages/IssueDetail.jsx`

### Want to See How Server Works? ⚙️
→ `backend/routes.js` (main API logic)

### Want to See Calculations? 📊
→ `backend/models.js` (algorithms & scoring)

### Want to Check Data Storage? 💾
→ `backend/smartfix.db` (created when you run the app)

### Want to Start Everything? 🚀
→ Read `QUICKSTART.md` at the root

---

## 🎯 Most Important Files to Know

| What | File | Purpose |
|------|------|---------|
| **Start frontend** | `frontend/src/main.jsx` | Entry point for user interface |
| **Start backend** | `backend/server.js` | Entry point for server |
| **Main app** | `frontend/src/App.jsx` | Handles page navigation |
| **Report issue** | `frontend/src/pages/ReportIssue.jsx` | Photo upload & report |
| **Map view** | `frontend/src/pages/MapView.jsx` | Shows all issues |
| **API endpoints** | `backend/routes.js` | Server requests handling |
| **Calculations** | `backend/models.js` | Severity scoring, algorithms |
| **Database** | `backend/db.js` | Data storage connection |

---

## 🟢 Quick Color Guide

- 📋 = Documentation file (read to understand)
- 📄 = Code file (programs & logic)
- 🎨 = Design file (styling & layout)
- ⚙️ = Config file (setup & settings)
- 🔌 = Connection file (links things together)
- 🌱 = Data file (sample information)
- 🧪 = Test file (checks if code works)
- 🐳 = Container file (Docker setup)
- 📁 = Folder (contains multiple files)

---

## 📱 Three Simple Parts to Remember

```
┌─────────────────────────────────────────┐
│  FRONTEND (frontend/)                   │
│  What users see: buttons, maps, forms   │
└──────────────┬──────────────────────────┘
               ↓ (sends data and requests)
┌─────────────────────────────────────────┐
│  BACKEND (backend/)                     │
│  Brain: processes, calculates, decides  │
└──────────────┬──────────────────────────┘
               ↓ (stores and retrieves data)
┌─────────────────────────────────────────┐
│  DATABASE (backend/smartfix.db)         │
│  Memory: stores all information         │
└─────────────────────────────────────────┘
```

That's it! Everything is organized into these 3 parts.

---

**Happy exploring! 🎉**
