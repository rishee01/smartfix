# SmartFix - Live Demo Script (60 Seconds)

## Demo Setup (Before Presentation)
- ✅ Backend running: `npm start` (port 5000)
- ✅ Frontend running: `npm run dev` (port 5173)
- ✅ Admin running: `npm run dev` (port 5174)
- ✅ Database seeded with sample data
- ✅ Test images ready for upload

---

## 60-Second Demo Script

### [0:00-0:05] **Landing Page**
"Let me show you SmartFix - a civic issue reporting system powered by AI and community."

*Navigate to http://localhost:5173*
"Here's our user-friendly homepage. Citizens can report issues, view the map, or check the leaderboard."

### [0:05-0:15] **Report an Issue**
"Click 'Report Issue'."

*Click Report Issue button*

"This page lets users upload a photo of a civic problem. Our AI automatically detects what type of issue it is."

*Upload image labeled "pothole"*

"Watch as the AI analyzes the photo... **Confidence: 92% - Pothole detected!**"

"The system automatically assigns severity (High/Medium/Low) and routes it to the right department."

### [0:15-0:25] **Community Verification**
"Let's verify this issue. Users can verify with one tap, adding credibility."

*Navigate to Issue Detail page*

"This issue has been verified 2 times. At 3 verifications, it becomes officially VERIFIED and gets higher priority."

"Users earn +2 points for verifying, encouraging community participation."

### [0:25-0:35] **Heatmap Visualization**
*Click Map page*

"Here's the heatmap showing all civic issues. Red zones indicate high-severity problem areas. The circles show issue density and severity combined."

"Admin can see exactly where to deploy resources. This is our hotspot analysis."

### [0:35-0:45] **Admin Dashboard**
*Navigate to http://localhost:5174 (admin login: admin@smartfix.local / admin123)*

"The admin dashboard provides real-time metrics: 5 total issues, 4 verified, 2 open, 0 SOS reports."

"Admin can sort by severity, filter by department, and update issue status in real-time."

"Click Export CSV to send data to municipal systems."

### [0:45-0:55] **Gamification & Leaderboard**
*Navigate to Leaderboard page*

"Here's our global leaderboard. Users compete for points by reporting and verifying issues."

"This drives engagement - citizens become civic heroes!"

### [0:55-1:00] **Closing**
"SmartFix turns citizen reports into actionable data for government. AI classifies issues, community verifies them, and volunteers resolve them."

"Ready to make cities smarter? 🚀"

---

## Key Demo Points to Emphasize

✅ **AI Automation** - Instant issue classification  
✅ **Gamification** - Points, leaderboard, engagement  
✅ **Community Validation** - Crowdsourced verification  
✅ **Heatmap** - Data visualization for decision-makers  
✅ **Admin Tools** - Real-time management dashboard  
✅ **Anonymous Reporting** - No login required  
✅ **SOS Mode** - Emergency one-tap reporting  

---

## Troubleshooting During Demo

| Issue | Fix |
|-------|-----|
| API not responding | Check backend: `npm start` |
| Photos not uploading | Check uploads/ folder permissions |
| Map not loading | Verify Leaflet CDN is available |
| Database empty | Run: `npm run seed` in backend |

---

**Pro Tips:**
- Use pre-loaded sample data for smooth demo
- Have images with filenames like "pothole.jpg" ready
- Show the "/api/heatmap" response in browser to prove data flow
- Mention "placeholder images" as "real user uploads"
