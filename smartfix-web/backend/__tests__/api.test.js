/**
 * Backend API Tests
 * Run with: npm test
 */

const request = require('supertest');
const express = require('express');
const routes = require('../routes');

const app = express();
app.use(express.json());
app.use(routes);

describe('SmartFix Backend API', () => {
  describe('POST /api/report', () => {
    it('should create a new report', async () => {
      const response = await request(app)
        .post('/api/report')
        .field('description', 'Test pothole')
        .field('lat', '28.6139')
        .field('lon', '77.2090')
        .field('label', 'pothole')
        .field('confidence', '0.92');

      expect(response.status).toBe(201);
      expect(response.body.id).toBeDefined();
      expect(response.body.message).toBe('Issue reported successfully');
    });

    it('should fail with missing fields', async () => {
      const response = await request(app)
        .post('/api/report')
        .send({ description: 'Test' });

      expect(response.status).toBe(500);
    });
  });

  describe('GET /api/reports', () => {
    it('should return all reports', async () => {
      const response = await request(app).get('/api/reports');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should filter by severity', async () => {
      const response = await request(app)
        .get('/api/reports')
        .query({ severity: 'High' });
      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/heatmap', () => {
    it('should return heatmap data', async () => {
      const response = await request(app).get('/api/heatmap');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /api/admin/metrics', () => {
    it('should return dashboard metrics', async () => {
      const response = await request(app).get('/api/admin/metrics');
      expect(response.status).toBe(200);
      expect(response.body.totalReports).toBeDefined();
    });
  });

  describe('POST /api/admin/login', () => {
    it('should login with correct credentials', async () => {
      const response = await request(app)
        .post('/api/admin/login')
        .send({
          email: 'admin@smartfix.local',
          password: 'admin123'
        });

      expect(response.status).toBe(200);
      expect(response.body.token).toBeDefined();
    });

    it('should fail with incorrect credentials', async () => {
      const response = await request(app)
        .post('/api/admin/login')
        .send({
          email: 'admin@smartfix.local',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
    });
  });
});
