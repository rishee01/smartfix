# SmartFix - Civic Issue Reporting System
## Architecture & System Design

## 📐 System Overview

SmartFix is a full-stack web application that enables citizens to report, verify, and resolve civic issues through crowdsourcing and community validation.

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT APPLICATIONS                      │
├──────────────────────┬──────────────────┬──────────────────┤
│  Frontend Website    │  Admin Dashboard │  Mobile Browser  │
│  (React + Vite)      │  (React + Vite)  │  (Responsive UI) │
└──────────┬───────────┴────────┬─────────┴────────┬─────────┘
           │                    │                  │
           └────────────────────┼──────────────────┘
                                │
                    ┌───────────▼────────────┐
                    │  REST API Endpoints    │
                    │  (Express.js Backend)  │
                    │  - /api/report         │
                    │  - /api/infer          │
                    │  - /api/heatmap        │
                    │  - /api/admin/*        │
                    └───────────┬────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
        ▼                       ▼                       ▼
   ┌─────────────┐      ┌──────────────┐      ┌──────────────┐
   │   SQLite    │      │ AI Inference │      │   File       │
   │  Database   │      │   Stub       │      │  Storage     │
   └─────────────┘      └──────────────┘      └──────────────┘
```

## 🏗️ Technology Stack

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite (lightning-fast HMR)
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Maps**: Leaflet + React Leaflet
- **HTTP Client**: Axios

### Admin Dashboard
- **Framework**: React 18
- **Build Tool**: Vite
- **Charts**: Recharts
- **Styling**: Tailwind CSS
- **Maps**: Leaflet

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite (dev) → PostgreSQL (production)
- **File Upload**: Multer
- **ID Generation**: UUID v4

### AI/ML
- **Current**: Python stub with heuristics
- **Production**: TensorFlow, PyTorch, or Cloud APIs

## 📊 Data Model

### Reports Table
```sql
CREATE TABLE reports (
  id TEXT PRIMARY KEY,
  photo_url TEXT,
  description TEXT,
  lat REAL,
  lon REAL,
  label TEXT,              -- Issue type (pothole, garbage, etc.)
  confidence REAL,         -- AI model confidence 0-1
  severity TEXT,           -- High/Medium/Low
  department TEXT,         -- Auto-routed department
  verified_count INTEGER,  -- Community verifications
  status TEXT,             -- Open/In-progress/Resolved
  is_sos INTEGER,         -- 0 or 1 for emergency
  created_at TEXT,
  updated_at TEXT
);
```

### Users Table
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT,
  points INTEGER,          -- Gamification points
  created_at TEXT
);
```

### Verifications Table
```sql
CREATE TABLE verifications (
  id TEXT PRIMARY KEY,
  report_id TEXT,
  user_id TEXT,
  created_at TEXT,
  FOREIGN KEY(report_id) REFERENCES reports(id),
  FOREIGN KEY(user_id) REFERENCES users(id)
);
```

### Volunteers Table
```sql
CREATE TABLE volunteers (
  id TEXT PRIMARY KEY,
  name TEXT,
  claimed_issues_count INTEGER,
  resolved_count INTEGER,
  joined_at TEXT
);
```

### Admin Users Table
```sql
CREATE TABLE admin_users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE,
  password TEXT,
  created_at TEXT
);
```

## 🔄 Data Flow

### Report Creation Flow
```
1. User uploads photo
   ↓
2. Frontend sends to /api/infer
   ↓
3. Backend calls AI model
   ↓
4. Model returns {label, confidence}
   ↓
5. Backend calculates severity & department
   ↓
6. Issue stored in database
   ↓
7. +10 points awarded to reporter (if not anonymous)
   ↓
8. Issue visible on map for verification
```

### Verification Flow
```
1. User clicks "Verify Issue"
   ↓
2. Check if already verified by this user
   ↓
3. Add to verifications table
   ↓
4. Increment report.verified_count
   ↓
5. Award +2 points to verifier
   ↓
6. If verified_count ≥ 3, boost severity if needed
   ↓
7. Update UI to show VERIFIED status
```

### Heatmap Calculation
```
For each unresolved issue:
  weight = 0
  
  // Severity factor
  if severity == "High": weight += 3
  else if severity == "Medium": weight += 2
  else: weight += 1
  
  // Verification boost
  weight += verified_count * 0.5
  
  // Recency factor (if needed)
  age_days = (now - created_at) / 86400
  weight -= age_days * 0.1  // Older issues fade
  
  // Unresolved priority
  if status == "Open": weight += 2
  else if status == "In-progress": weight += 1
  
Return map of {lat, lon, weight} for visualization
```

## 🎮 Gamification System

| Action | Points | Details |
|--------|--------|---------|
| Report Issue | +10 | Only if not anonymous |
| Verify Issue | +2 | Max 1x per user per issue |
| Resolve Issue | +20 | Awarded to volunteer |
| Reach 100 points | Badge | "Civic Hero" |
| Reach 500 points | Badge | "Community Leader" |
| First 50 Reports | Badge | "Issue Champion" |

**Leaderboard**: Top 20 global users by points, updated real-time.

## 🛣️ API Routes

### Public Endpoints

```
POST /api/infer
├── Input: photo file (multipart)
└── Output: { label, confidence }

POST /api/report
├── Input: description, lat, lon, label, confidence, isAnonymous, isSOS, photo
├── Output: { id, message }
└── Side Effects: +10 points to user (if not anonymous)

GET /api/reports
├── Query: ?severity=High&status=Open&department=R&B&verified=true
└── Output: [{ id, photo_url, description, lat, lon, label, confidence, severity, department, verified_count, status, created_at, updated_at }, ...]

GET /api/reports/:id
└── Output: { ...report, timeToResolve: { hours, text } }

POST /api/report/:id/verify
├── Input: { userId }
└── Side Effects: +2 points to user, increment verified_count

GET /api/heatmap
└── Output: [{ lat, lon, weight, severity, id }, ...]

GET /api/leaderboard
└── Output: [{ id, name, points }, ...] (top 20)
```

### Admin Endpoints

```
POST /api/admin/login
├── Input: { email, password }
└── Output: { token, email }

GET /api/admin/metrics
└── Output: { totalReports, verifiedReports, openReports, sosReports, avgResolutionHours }

POST /api/admin/report/:id/status
├── Input: { status }
└── Side Effects: Update issue status, award points if resolved

GET /api/admin/exports/csv
└── Output: CSV file of all reports

POST /api/report/:id/assign
├── Input: { volunteerId }
└── Side Effects: Update issue status, increment volunteer claimed count

POST /api/volunteer/claim/:id
├── Input: { volunteerId }
└── Side Effects: Same as assign
```

## 🚀 Deployment Architecture

### Development
```
Frontend: npm run dev (port 5173)
Admin: npm run dev (port 5174)
Backend: npm start (port 5000)
Model: (embedded in backend)
```

### Production
```
Frontend → Vercel / Netlify CDN
Admin → GitHub Pages / Firebase Hosting
Backend → Heroku / Railway / AWS Lambda
Database → PostgreSQL on RDS
Storage → AWS S3 / Cloudinary
```

## 🔐 Security Considerations

- **Authentication**: Admin login with hashed passwords (TODO: bcrypt)
- **Authorization**: Admin token validation on protected routes (TODO: JWT middleware)
- **Data Privacy**: Anonymous reporting option, no email collection required
- **File Upload**: Validate MIME types, scan for malware (TODO: ClamAV)
- **API Rate Limiting**: (TODO: express-rate-limit)
- **CORS**: Enabled for frontend domains only (TODO: whitelist)

## 📈 Performance Optimizations

1. **Frontend**: Code splitting, lazy loading, image optimization
2. **Backend**: Database indexing on lat/lon for map queries
3. **Heatmap**: Cluster issues by grid cell for large datasets
4. **Caching**: Redis for leaderboard (TODO)
5. **CDN**: Serve static assets from CDN

## 🔄 Real-time Updates (Future)

- WebSocket for live issue updates
- Server-Sent Events (SSE) for push notifications
- Volunteer status changes broadcast to admins

## 📱 Mobile Considerations

- Responsive design (Tailwind breakpoints)
- Touch-friendly buttons
- Geolocation API integration
- Progressive Web App (PWA) capabilities (TODO)

## 🧪 Testing Strategy

- **Unit Tests**: Jest for backend API
- **Integration Tests**: Supertest for API endpoints
- **E2E Tests**: Cypress for frontend user flows (TODO)
- **Load Testing**: k6 for stress testing (TODO)

## 📝 Monitoring & Logging

- Error tracking: Sentry (TODO)
- Analytics: Google Analytics / Mixpanel
- Logs: Winston / Morgan (TODO)
- Uptime Monitoring: Pingdom / UptimeRobot

## 🛣️ Roadmap

### Phase 1 (v1.0) - MVP ✅
- [x] Issue reporting with photo
- [x] AI classification
- [x] Community verification
- [x] Admin dashboard
- [x] Gamification

### Phase 2 (v1.5)
- [ ] Real-time WebSocket updates
- [ ] Email notifications
- [ ] Mobile app (React Native)
- [ ] Payment integration for volunteer rewards
- [ ] Multi-language support

### Phase 3 (v2.0)
- [ ] Advanced ML model (YOLO, TensorFlow)
- [ ] Computer vision for damage assessment
- [ ] Automated volunteer assignment
- [ ] Integration with municipal systems
- [ ] Blockchain for verification (experimental)

---

**Built for National Hackathon 2025**
