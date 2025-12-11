const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const { dbRun, dbGet, dbAll } = require('./db');
const { SEVERITY_MAP, DEPARTMENT_MAP } = require('./models');

const router = express.Router();

// Multer setup for file uploads
const upload = multer({ dest: 'uploads/' });

// Helper: Calculate heatmap weight
function calculateHeatmapWeight(report) {
  let weight = 0;
  
  // Severity weight
  if (report.severity === 'High') weight += 3;
  else if (report.severity === 'Medium') weight += 2;
  else weight += 1;

  // Verification boost
  weight += report.verified_count * 0.5;

  // Status factor (unresolved = higher priority)
  if (report.status === 'Open') weight += 2;
  else if (report.status === 'In-progress') weight += 1;

  return weight;
}

// Helper: Calculate time-to-resolve estimate
function getTimeToResolveEstimate(severity, label) {
  if (severity === 'High') return { hours: 36, text: '24-48 hours' };
  if (severity === 'Medium') return { hours: 72, text: '~72 hours' };
  return { hours: 168, text: '5-7 days' };
}

// AI Inference - stub
router.post('/api/infer', upload.single('photo'), async (req, res) => {
  try {
    // Mock inference - in production, call ML model
    const labels = ['pothole', 'overflowing_garbage', 'water_leakage', 'streetlight_not_working', 'illegal_dumping', 'other'];
    
    let selectedLabel = labels[Math.floor(Math.random() * labels.length)];
    let confidence = 0.70 + Math.random() * 0.25;

    // Simple heuristics for demo
    if (req.file && req.file.originalname.toLowerCase().includes('pothole')) {
      selectedLabel = 'pothole';
      confidence = 0.95;
    }

    res.json({
      label: selectedLabel,
      confidence: parseFloat(confidence.toFixed(2))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create report
router.post('/api/report', upload.single('photo'), async (req, res) => {
  try {
    const { description, lat, lon, label, confidence, isAnonymous } = req.body;
    const isSOS = req.body.isSOS === 'true' || req.body.isSOS === true;
    
    const reportId = uuidv4();
    const severity = isSOS ? 'High' : (SEVERITY_MAP[label] || 'Low');
    const department = isSOS ? 'Emergency Response' : (DEPARTMENT_MAP[label] || 'General Admin');
    const photoUrl = req.file ? `/uploads/${req.file.filename}` : 'https://via.placeholder.com/500';

    const now = new Date().toISOString();

    await dbRun(
      `INSERT INTO reports 
      (id, photo_url, description, lat, lon, label, confidence, severity, department, verified_count, status, is_sos, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        reportId,
        photoUrl,
        description,
        parseFloat(lat),
        parseFloat(lon),
        label,
        parseFloat(confidence),
        severity,
        department,
        0,
        'Open',
        isSOS ? 1 : 0,
        now,
        now
      ]
    );

    // Award points to user if not anonymous
    if (!isAnonymous && req.body.userId) {
      await dbRun('UPDATE users SET points = points + 10 WHERE id = ?', [req.body.userId]);
    }

    res.status(201).json({
      id: reportId,
      message: 'Issue reported successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all reports with filters
router.get('/api/reports', async (req, res) => {
  try {
    const { severity, status, department, verified } = req.query;
    
    let query = 'SELECT * FROM reports WHERE 1=1';
    const params = [];

    if (severity) {
      query += ' AND severity = ?';
      params.push(severity);
    }
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    if (department) {
      query += ' AND department = ?';
      params.push(department);
    }
    if (verified === 'true') {
      query += ' AND verified_count >= 3';
    }

    query += ' ORDER BY created_at DESC';

    const reports = await dbAll(query, params);
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single report
router.get('/api/reports/:id', async (req, res) => {
  try {
    const report = await dbGet('SELECT * FROM reports WHERE id = ?', [req.params.id]);
    if (!report) return res.status(404).json({ error: 'Report not found' });

    // Add time-to-resolve estimate
    const estimate = getTimeToResolveEstimate(report.severity, report.label);
    report.timeToResolve = estimate;

    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify issue (community validation)
router.post('/api/report/:id/verify', async (req, res) => {
  try {
    const { userId } = req.body;
    const reportId = req.params.id;

    // Check if already verified by this user
    const existing = await dbGet(
      'SELECT * FROM verifications WHERE report_id = ? AND user_id = ?',
      [reportId, userId]
    );

    if (existing) {
      return res.status(400).json({ error: 'Already verified by this user' });
    }

    // Add verification
    const verificationId = uuidv4();
    await dbRun(
      'INSERT INTO verifications (id, report_id, user_id, created_at) VALUES (?, ?, ?, ?)',
      [verificationId, reportId, userId, new Date().toISOString()]
    );

    // Increment verified count
    await dbRun('UPDATE reports SET verified_count = verified_count + 1 WHERE id = ?', [reportId]);

    // Award points to verifying user
    await dbRun('UPDATE users SET points = points + 2 WHERE id = ?', [userId]);

    // Check if verified_count >= 3 and boost severity if needed
    const report = await dbGet('SELECT * FROM reports WHERE id = ?', [reportId]);
    if (report.verified_count >= 3 && report.severity !== 'High') {
      await dbRun('UPDATE reports SET severity = ? WHERE id = ?', ['High', reportId]);
    }

    res.json({ message: 'Issue verified', verified_count: report.verified_count + 1 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Assign issue to volunteer
router.post('/api/report/:id/assign', async (req, res) => {
  try {
    const { volunteerId } = req.body;
    const reportId = req.params.id;

    await dbRun('UPDATE reports SET status = ? WHERE id = ?', ['In-progress', reportId]);
    await dbRun('UPDATE volunteers SET claimed_issues_count = claimed_issues_count + 1 WHERE id = ?', [volunteerId]);

    res.json({ message: 'Issue assigned to volunteer' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Volunteer claims issue
router.post('/api/volunteer/claim/:id', async (req, res) => {
  try {
    const { volunteerId } = req.body;
    const reportId = req.params.id;

    await dbRun('UPDATE reports SET status = ? WHERE id = ?', ['In-progress', reportId]);
    await dbRun('UPDATE volunteers SET claimed_issues_count = claimed_issues_count + 1 WHERE id = ?', [volunteerId]);

    res.json({ message: 'Issue claimed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get heatmap data
router.get('/api/heatmap', async (req, res) => {
  try {
    const reports = await dbAll('SELECT id, lat, lon, severity, verified_count, status FROM reports WHERE status != ?', ['Resolved']);
    
    const heatmapData = reports.map(report => ({
      lat: report.lat,
      lon: report.lon,
      weight: calculateHeatmapWeight(report),
      severity: report.severity,
      id: report.id
    }));

    res.json(heatmapData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get leaderboard
router.get('/api/leaderboard', async (req, res) => {
  try {
    const users = await dbAll('SELECT id, name, points FROM users ORDER BY points DESC LIMIT 20');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Dashboard metrics
router.get('/api/admin/metrics', async (req, res) => {
  try {
    const totalReports = await dbGet('SELECT COUNT(*) as count FROM reports');
    const verifiedReports = await dbGet('SELECT COUNT(*) as count FROM reports WHERE verified_count >= 3');
    const openReports = await dbGet('SELECT COUNT(*) as count FROM reports WHERE status = ?', ['Open']);
    const sosReports = await dbGet('SELECT COUNT(*) as count FROM reports WHERE is_sos = 1');

    const avgResolutionTime = await dbGet(
      'SELECT AVG(CAST((julianday(updated_at) - julianday(created_at)) * 24 AS INTEGER)) as hours FROM reports WHERE status = ?',
      ['Resolved']
    );

    res.json({
      totalReports: totalReports.count,
      verifiedReports: verifiedReports.count,
      openReports: openReports.count,
      sosReports: sosReports.count,
      avgResolutionHours: Math.round(avgResolutionTime.hours || 0)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Update report status
router.post('/api/admin/report/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const reportId = req.params.id;

    const validStatuses = ['Open', 'In-progress', 'Resolved'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    await dbRun('UPDATE reports SET status = ?, updated_at = ? WHERE id = ?', [status, new Date().toISOString(), reportId]);

    // Award points if resolved
    if (status === 'Resolved') {
      // TODO: Award 20 points to assigned volunteer
    }

    res.json({ message: 'Status updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Export CSV
router.get('/api/admin/exports/csv', async (req, res) => {
  try {
    const reports = await dbAll('SELECT * FROM reports ORDER BY created_at DESC');

    let csv = 'ID,Description,Severity,Department,Status,Verified Count,Created At\n';
    reports.forEach(report => {
      csv += `"${report.id}","${report.description}","${report.severity}","${report.department}","${report.status}","${report.verified_count}","${report.created_at}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="smartfix-reports.csv"');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Login (stub)
router.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verify against seeded admin
    if (email === 'admin@smartfix.local' && password === 'admin123') {
      res.json({ token: 'stub-token-' + Date.now(), email });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
