# SmartFix Web - Civic Issue Reporting System

A complete, production-ready website for reporting and tracking civic issues (potholes, garbage, water leaks, etc.) with AI-powered image classification, community validation, and gamification.

## 🏗️ Project Structure

```
smartfix-web/
├── frontend/          # React + Vite - Public user website
├── admin/             # React + Vite - Admin dashboard
├── backend/           # Node.js + Express - API server
├── model/             # Python inference stub
├── docs/              # Documentation & pitch deck
├── .env.example       # Environment template
└── README.md          # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.8+ (for model stub)
- npm or yarn

### 1. Backend Setup
```bash
cd backend
npm install
npm run seed              # Initialize database
npm start                 # Runs on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev              # Runs on http://localhost:5173
```

### 3. Admin Dashboard Setup
```bash
cd admin
npm install
npm run dev              # Runs on http://localhost:5174
```

### 4. Model Stub (Optional)
```bash
cd model
python infer_stub.py     # Runs on http://localhost:5001
```

## 📋 Core Features (A-J)

| Feature | Description |
|---------|-------------|
| **A** | AI-Based Issue Detection from Photo (classifier: pothole, garbage, water leakage, etc.) |
| **B** | Issue Severity Scoring (High/Medium/Low with rule-based system) |
| **C** | Predictive Hotspot Map (heatmap showing issue density & severity) |
| **D** | Community Validation (users verify issues → boost priority) |
| **E** | Auto-Routing Issues (pothole→R&B, garbage→Sanitation, etc.) |
| **F** | Volunteer/NGO Integration (claim issues, update status, upload proof) |
| **G** | Gamification (earn points for reporting/verifying/resolving) |
| **H** | Time-to-Resolve Prediction (24-48h for High, 72h for Medium, 5-7d for Low) |
| **I** | SOS/Emergency Reporting (one-tap emergency with auto-high priority) |
| **J** | Anonymous Reporting (no login required, location + photo accepted) |

## 🔌 API Endpoints

### Core Endpoints
- `POST /api/infer` - AI image classification
- `POST /api/report` - Create new issue report
- `GET /api/reports` - Fetch all reports (with filters)
- `GET /api/reports/:id` - Get single issue
- `POST /api/report/:id/verify` - Community verification
- `POST /api/report/:id/assign` - Assign to volunteer/department
- `POST /api/volunteer/claim/:id` - Volunteer claims issue
- `GET /api/heatmap` - Get heatmap data

### Admin Endpoints
- `POST /api/admin/login` - Admin authentication
- `POST /api/admin/report/:id/status` - Update issue status
- `GET /api/admin/metrics` - Dashboard metrics
- `GET /api/admin/exports/csv` - Export reports as CSV

## 📊 Data Model

### Reports Table
```sql
id, photo_url, description, lat, lon, label, confidence,
severity, department, verified_count, status, created_at, updated_at
```

### Users Table
```sql
id, name, email, points, created_at
```

### Volunteers Table
```sql
id, name, claimed_issues_count, resolved_count, joined_at
```

### Verifications Table
```sql
id, report_id, user_id, created_at
```

## 🎮 Gamification System

- **+10 points** - Report legitimate issue
- **+2 points** - Verify another user's issue
- **+20 points** - Volunteer resolves issue
- **Leaderboard** - Global rankings displayed in frontend & admin

## 🔒 Authentication

- Frontend: Anonymous mode + optional account (stub)
- Admin: Seeded admin user
  - Email: `admin@smartfix.local`
  - Password: `admin123`

## 🧪 Testing

Run backend tests:
```bash
cd backend
npm test
```

## 📚 Documentation

- `docs/pitch-deck.md` - 10-slide presentation
- `docs/demo-script.md` - 60-second live demo steps
- `docs/architecture.md` - System design & data flow

## 🚢 Deployment Notes

- **Frontend**: Deploy to Vercel, Netlify, or GitHub Pages
- **Admin**: Deploy separately for access control
- **Backend**: Deploy to Heroku, Railway, or AWS Lambda
- **Database**: Migrate from SQLite to PostgreSQL for production
- **Model**: Integrate real ML model (TensorFlow, PyTorch) instead of stub

## 📝 TODO / Next Steps

- [ ] Integrate real ML model (YOLO for pothole detection)
- [ ] Add real-time notifications (WebSocket)
- [ ] Implement email alerts for volunteers
- [ ] Add payment integration for paid volunteer rewards
- [ ] Setup CI/CD pipeline (GitHub Actions)
- [ ] Add analytics dashboard
- [ ] Implement mobile app version
- [ ] Add multi-language support

## 📄 License

MIT

## 👥 Team

Built for the 36-hour National Hackathon 2025.

---

**Questions?** Check `docs/architecture.md` for system design details.
