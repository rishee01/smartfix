const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const { dbRun, dbGet, dbAll } = require('./db');
const { 
  SEVERITY_MAP, 
  DEPARTMENT_MAP, 
  CONFIDENCE_SEVERITY_BOOST,
  DEPARTMENT_ESCALATION,
  RESOLUTION_TIME_MAP
} = require('./models');

const router = express.Router();

// Multer setup for file uploads
const upload = multer({ dest: 'uploads/' });

// HELPER: Calculate advanced severity score
function calculateAdvancedSeverity(label, confidence, verified_count, is_sos) {
  // Base severity from map
  let baseSeverity = SEVERITY_MAP[label] || 'Low';
  let score = baseSeverity === 'High' ? 10 : baseSeverity === 'Medium' ? 6 : 3;
  
  // Boost based on AI confidence
  const confidenceMultiplier = confidence > 0.9 ? 1.5 : confidence > 0.8 ? 1.3 : confidence > 0.7 ? 1.1 : 1.0;
  score *= confidenceMultiplier;
  
  // Community verification boost
  score += verified_count * 0.5;
  
  // SOS multiplier
  if (is_sos) score *= 2.5;
  
  // Convert score back to severity level
  if (score >= 15) return 'Critical';
  if (score >= 10) return 'High';
  if (score >= 6) return 'Medium';
  return 'Low';
}

// HELPER: Calculate heatmap weight with advanced algorithm
function calculateHeatmapWeight(report) {
  let weight = 0;
  
  // Severity weight with multiplier
  const severityWeights = { 'Critical': 5, 'High': 3, 'Medium': 2, 'Low': 1 };
  weight += (severityWeights[report.severity] || 1);

  // Verification boost (more verifications = higher priority)
  weight += report.verified_count * 0.8;

  // Status factor (unresolved = higher priority)
  if (report.status === 'Open') weight += 3;
  else if (report.status === 'In-progress') weight += 1.5;

  // SOS boost
  if (report.is_sos) weight += 5;

  // Recency boost (newer issues get slight boost)
  const daysSinceReport = (Date.now() - new Date(report.created_at).getTime()) / (1000 * 60 * 60 * 24);
  weight += Math.max(0, 2 - daysSinceReport * 0.1);

  return weight;
}

// HELPER: Intelligent time-to-resolve prediction
function getTimeToResolveEstimate(severity, label, verified_count) {
  // Base time from map
  const key = `${label}|${severity}`;
  let baseHours = RESOLUTION_TIME_MAP[key] || (severity === 'High' ? 36 : severity === 'Medium' ? 72 : 168);
  
  // Reduce time if highly verified (indicates urgency & visibility)
  if (verified_count >= 5) baseHours *= 0.7;
  else if (verified_count >= 3) baseHours *= 0.85;
  
  // Convert to readable format
  if (baseHours < 24) return { hours: baseHours, text: `~${Math.round(baseHours)} hours` };
  const days = Math.ceil(baseHours / 24);
  return { hours: baseHours, text: `${days} day${days > 1 ? 's' : ''}` };
}

// HELPER: Calculate gamification points dynamically
function calculatePointsForAction(action, report_data = {}) {
  const pointsMap = {
    'report_issue': 10,
    'report_sos': 25,
    'verify_issue': 2,
    'verify_critical': 5,
    'volunteer_claim': 5,
    'volunteer_resolve': 20,
    'volunteer_proof_upload': 10,
    'media_featured': 50
  };
  
  if (action === 'report_issue' && report_data.is_sos) return pointsMap['report_sos'];
  if (action === 'verify_issue' && report_data.severity === 'Critical') return pointsMap['verify_critical'];
  
  return pointsMap[action] || 0;
}

// HELPER: Determine escalation department
function getEscalationDept(primary_dept, severity, verified_count) {
  const escalationChain = DEPARTMENT_ESCALATION[primary_dept] || ['Administrator'];
  
  if (severity === 'Critical' && verified_count >= 5) {
    return escalationChain[1] || escalationChain[0]; // Escalate to top
  }
  return escalationChain[0]; // Primary department
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
    const { description, lat, lon, label, confidence, isAnonymous, userId } = req.body;
    const isSOS = req.body.isSOS === 'true' || req.body.isSOS === true;
    
    const reportId = uuidv4();
    
    // Use advanced severity calculation
    const severity = calculateAdvancedSeverity(label, parseFloat(confidence), 0, isSOS);
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

    // Award points to user based on report type
    if (!isAnonymous && userId) {
      const pointsEarned = calculatePointsForAction(isSOS ? 'report_sos' : 'report_issue', { is_sos: isSOS });
      await dbRun('UPDATE users SET points = points + ? WHERE id = ?', [pointsEarned, userId]);
    }

    res.status(201).json({
      id: reportId,
      message: 'Issue reported successfully',
      severity: severity,
      department: department
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

    // Add time-to-resolve estimate with enhanced algorithm
    const estimate = getTimeToResolveEstimate(report.severity, report.label, report.verified_count);
    report.timeToResolve = estimate;

    // Add escalation status
    report.escalatedDept = report.verified_count >= 5 ? 
      getEscalationDept(report.department, report.severity, report.verified_count) : 
      report.department;

    // Add actionability score (how urgent/actionable is this?)
    const actionabilityScore = Math.min(100, 
      (report.verified_count * 15) + 
      (report.severity === 'Critical' ? 40 : report.severity === 'High' ? 25 : 10) +
      (report.is_sos ? 25 : 0)
    );
    report.actionabilityScore = actionabilityScore;

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

    // Get current report details
    const report = await dbGet('SELECT * FROM reports WHERE id = ?', [reportId]);
    
    // Add verification
    const verificationId = uuidv4();
    await dbRun(
      'INSERT INTO verifications (id, report_id, user_id, created_at) VALUES (?, ?, ?, ?)',
      [verificationId, reportId, userId, new Date().toISOString()]
    );

    // Increment verified count
    await dbRun('UPDATE reports SET verified_count = verified_count + 1 WHERE id = ?', [reportId]);

    // Award dynamic points based on severity
    const pointsEarned = calculatePointsForAction(
      report.severity === 'Critical' ? 'verify_critical' : 'verify_issue',
      { severity: report.severity }
    );
    await dbRun('UPDATE users SET points = points + ? WHERE id = ?', [pointsEarned, userId]);

    // Recalculate severity with new verification count
    const newVerifiedCount = report.verified_count + 1;
    const newSeverity = calculateAdvancedSeverity(report.label, report.confidence, newVerifiedCount, report.is_sos);

    // Update severity if it changed
    if (newSeverity !== report.severity) {
      await dbRun('UPDATE reports SET severity = ? WHERE id = ?', [newSeverity, reportId]);
    }

    // Auto-escalate if highly verified
    if (newVerifiedCount >= 5) {
      const escalatedDept = getEscalationDept(report.department, newSeverity, newVerifiedCount);
      if (escalatedDept !== report.department) {
        await dbRun('UPDATE reports SET department = ? WHERE id = ?', [escalatedDept, reportId]);
      }
    }

    res.json({ 
      message: 'Issue verified', 
      verified_count: newVerifiedCount,
      points_earned: pointsEarned,
      new_severity: newSeverity
    });
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

// Admin: Advanced Dashboard metrics
router.get('/api/admin/metrics', async (req, res) => {
  try {
    const totalReports = await dbGet('SELECT COUNT(*) as count FROM reports');
    const verifiedReports = await dbGet('SELECT COUNT(*) as count FROM reports WHERE verified_count >= 3');
    const openReports = await dbGet('SELECT COUNT(*) as count FROM reports WHERE status = ?', ['Open']);
    const sosReports = await dbGet('SELECT COUNT(*) as count FROM reports WHERE is_sos = 1');
    const criticalReports = await dbGet('SELECT COUNT(*) as count FROM reports WHERE severity = ?', ['Critical']);

    const avgResolutionTime = await dbGet(
      'SELECT AVG(CAST((julianday(updated_at) - julianday(created_at)) * 24 AS INTEGER)) as hours FROM reports WHERE status = ?',
      ['Resolved']
    );

    // Category breakdown
    const byCategory = await dbAll(
      'SELECT label, COUNT(*) as count, severity FROM reports GROUP BY label'
    );

    // Department metrics
    const byDepartment = await dbAll(
      'SELECT department, COUNT(*) as count, AVG(CAST((julianday(updated_at) - julianday(created_at)) * 24 AS REAL)) as avg_resolution_hours FROM reports GROUP BY department'
    );

    // Verification statistics
    const avgVerifications = await dbGet(
      'SELECT AVG(verified_count) as avg_verifications FROM reports'
    );

    // Top volunteers
    const topVolunteers = await dbAll(
      'SELECT name, resolved_count, claimed_issues_count FROM volunteers ORDER BY resolved_count DESC LIMIT 5'
    );

    // Community engagement
    const totalUsers = await dbGet('SELECT COUNT(*) as count FROM users');
    const avgUserPoints = await dbGet('SELECT AVG(points) as avg_points FROM users');

    res.json({
      totalReports: totalReports.count,
      verifiedReports: verifiedReports.count,
      openReports: openReports.count,
      sosReports: sosReports.count,
      criticalReports: criticalReports.count,
      avgResolutionHours: Math.round(avgResolutionTime.hours || 0),
      categoryBreakdown: byCategory,
      departmentMetrics: byDepartment,
      avgVerificationsPerIssue: parseFloat(avgVerifications.avg_verifications || 0).toFixed(1),
      topVolunteers: topVolunteers,
      totalUsers: totalUsers.count,
      avgUserPointsPerPerson: Math.round(avgUserPoints.avg_points || 0),
      verificationRate: ((verifiedReports.count / totalReports.count) * 100).toFixed(1) + '%'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Update report status with volunteer points
router.post('/api/admin/report/:id/status', async (req, res) => {
  try {
    const { status, volunteerId } = req.body;
    const reportId = req.params.id;

    const validStatuses = ['Open', 'In-progress', 'Resolved'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const report = await dbGet('SELECT * FROM reports WHERE id = ?', [reportId]);

    await dbRun('UPDATE reports SET status = ?, updated_at = ? WHERE id = ?', 
      [status, new Date().toISOString(), reportId]);

    // Award points if resolved
    if (status === 'Resolved' && volunteerId) {
      const pointsEarned = calculatePointsForAction('volunteer_resolve', report);
      await dbRun('UPDATE volunteers SET resolved_count = resolved_count + 1 WHERE id = ?', [volunteerId]);
      // TODO: Also award points to associated user if tracking user-volunteer link
    }

    res.json({ message: 'Status updated', points_awarded: status === 'Resolved' ? 20 : 0 });
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
