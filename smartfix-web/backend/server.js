const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { initDb, seedData } = require('./models');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || process.env.BACKEND_PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));

// Serve static frontend files in production
if (NODE_ENV === 'production') {
  // Serve frontend build
  const frontendPath = path.join(__dirname, '..', 'frontend', 'dist');
  app.use(express.static(frontendPath));

  // Serve admin build
  const adminPath = path.join(__dirname, '..', 'admin', 'dist');
  app.use('/admin', express.static(adminPath));
}

// Initialize database
(async () => {
  await initDb();
  if (NODE_ENV === 'development') {
    await seedData();
  }
})();

// Routes
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), environment: NODE_ENV });
});

// Serve frontend SPA fallback routes
if (NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    const indexPath = path.join(__dirname, '..', 'frontend', 'dist', 'index.html');
    res.sendFile(indexPath);
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ error: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`🏛️ CivicSense Backend running on http://localhost:${PORT}`);
  console.log(`📍 Admin credentials: admin@civicsense.local / admin123`);
  console.log(`📚 API docs: Check docs/architecture.md`);
  console.log(`🔧 Environment: ${NODE_ENV}`);
});
