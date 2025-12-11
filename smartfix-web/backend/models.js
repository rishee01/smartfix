const { dbRun, dbAll, dbGet } = require('./db');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

// Severity levels mapping - with damage assessment factors
const SEVERITY_MAP = {
  pothole: 'High',
  water_leakage: 'High',
  overflowing_garbage: 'Medium',
  streetlight_not_working: 'Medium',
  illegal_dumping: 'Medium',
  other: 'Low'
};

// Damage severity multipliers based on confidence scores
const CONFIDENCE_SEVERITY_BOOST = {
  0.95: 1.3,  // Very high confidence → boost severity
  0.85: 1.2,
  0.75: 1.1,
  0.65: 1.0,
  0.0: 0.8    // Low confidence → lower severity
};

// Department routing with escalation rules
const DEPARTMENT_MAP = {
  pothole: 'R&B',
  overflowing_garbage: 'Sanitation',
  water_leakage: 'Municipal Water',
  streetlight_not_working: 'Electrical Dept',
  illegal_dumping: 'Sanitation',
  other: 'General Admin'
};

// Department escalation matrix
const DEPARTMENT_ESCALATION = {
  'R&B': ['City Engineer', 'PWD Chief'],
  'Sanitation': ['Cleanliness Officer', 'Municipal Commissioner'],
  'Municipal Water': ['Water Department Head', 'Municipal Commissioner'],
  'Electrical Dept': ['Chief Electrical Officer', 'Municipal Commissioner'],
  'General Admin': ['Administrator', 'Municipal Commissioner']
};

// Time-to-resolve baselines (in hours) - refined based on data
const RESOLUTION_TIME_MAP = {
  'pothole|High': 24,
  'water_leakage|High': 18,
  'streetlight_not_working|Medium': 48,
  'overflowing_garbage|Medium': 12,
  'illegal_dumping|Medium': 36,
  'other|Low': 72
};

// Initialize schema
async function initDb() {
  // Reports table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS reports (
      id TEXT PRIMARY KEY,
      photo_url TEXT,
      description TEXT,
      lat REAL,
      lon REAL,
      label TEXT,
      confidence REAL,
      severity TEXT,
      department TEXT,
      verified_count INTEGER DEFAULT 0,
      status TEXT DEFAULT 'Open',
      is_sos INTEGER DEFAULT 0,
      created_at TEXT,
      updated_at TEXT
    )
  `);

  // Users table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT,
      email TEXT,
      points INTEGER DEFAULT 0,
      created_at TEXT
    )
  `);

  // Volunteers table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS volunteers (
      id TEXT PRIMARY KEY,
      name TEXT,
      claimed_issues_count INTEGER DEFAULT 0,
      resolved_count INTEGER DEFAULT 0,
      joined_at TEXT
    )
  `);

  // Verifications table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS verifications (
      id TEXT PRIMARY KEY,
      report_id TEXT,
      user_id TEXT,
      created_at TEXT,
      FOREIGN KEY(report_id) REFERENCES reports(id),
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);

  // Admin users table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE,
      password TEXT,
      created_at TEXT
    )
  `);

  console.log('✅ Database initialized');
}

// Seed data
async function seedData() {
  try {
    // Clear existing data
    await dbRun('DELETE FROM verifications');
    await dbRun('DELETE FROM reports');
    await dbRun('DELETE FROM users');
    await dbRun('DELETE FROM volunteers');
    await dbRun('DELETE FROM admin_users');

    // Seed admin user
    const adminId = uuidv4();
    await dbRun(
      'INSERT INTO admin_users (id, email, password, created_at) VALUES (?, ?, ?, ?)',
      [adminId, 'admin@smartfix.local', 'admin123', new Date().toISOString()]
    );

    // Seed sample reports
    const reports = [
      {
        lat: 28.6139,
        lon: 77.2090,
        description: 'Large pothole on Main Street',
        label: 'pothole',
        confidence: 0.92
      },
      {
        lat: 28.6155,
        lon: 77.2100,
        description: 'Overflowing garbage bin near park',
        label: 'overflowing_garbage',
        confidence: 0.88
      },
      {
        lat: 28.6200,
        lon: 77.2050,
        description: 'Water leaking from pipe',
        label: 'water_leakage',
        confidence: 0.95
      },
      {
        lat: 28.6120,
        lon: 77.2110,
        description: 'Streetlight not working at night',
        label: 'streetlight_not_working',
        confidence: 0.85
      },
      {
        lat: 28.6180,
        lon: 77.2080,
        description: 'Illegal dumping site',
        label: 'illegal_dumping',
        confidence: 0.90
      }
    ];

    for (let i = 0; i < reports.length; i++) {
      const reportId = uuidv4();
      const report = reports[i];
      const severity = SEVERITY_MAP[report.label];
      const department = DEPARTMENT_MAP[report.label];
      
      await dbRun(
        `INSERT INTO reports 
        (id, photo_url, description, lat, lon, label, confidence, severity, department, verified_count, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          reportId,
          `https://via.placeholder.com/500?text=${report.label}`,
          report.description,
          report.lat,
          report.lon,
          report.label,
          report.confidence,
          severity,
          department,
          Math.floor(Math.random() * 5),
          ['Open', 'In-progress', 'Resolved'][Math.floor(Math.random() * 3)],
          new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          new Date().toISOString()
        ]
      );
    }

    // Seed sample users
    for (let i = 0; i < 5; i++) {
      const userId = uuidv4();
      await dbRun(
        'INSERT INTO users (id, name, email, points, created_at) VALUES (?, ?, ?, ?, ?)',
        [userId, `User ${i + 1}`, `user${i + 1}@example.com`, Math.floor(Math.random() * 200) + 10, new Date().toISOString()]
      );
    }

    // Seed sample volunteers
    for (let i = 0; i < 3; i++) {
      const volunteerId = uuidv4();
      await dbRun(
        'INSERT INTO volunteers (id, name, claimed_issues_count, resolved_count, joined_at) VALUES (?, ?, ?, ?, ?)',
        [volunteerId, `Volunteer ${i + 1}`, Math.floor(Math.random() * 10), Math.floor(Math.random() * 8), new Date().toISOString()]
      );
    }

    console.log('✅ Database seeded with sample data');
  } catch (error) {
    console.error('❌ Seed error:', error);
  }
}

module.exports = { 
  initDb, 
  seedData, 
  SEVERITY_MAP, 
  DEPARTMENT_MAP,
  CONFIDENCE_SEVERITY_BOOST,
  DEPARTMENT_ESCALATION,
  RESOLUTION_TIME_MAP
};
