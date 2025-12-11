const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { initDb, seedData } = require('./models');
const routes = require('./routes');

const app = express();
const PORT = process.env.BACKEND_PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));

// Initialize database
(async () => {
  await initDb();
  await seedData();
})();

// Routes
app.use(routes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 SmartFix Backend running on http://localhost:${PORT}`);
  console.log(`📍 Admin credentials: admin@smartfix.local / admin123`);
  console.log(`📚 API docs: Check docs/architecture.md`);
});
