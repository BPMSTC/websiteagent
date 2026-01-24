import express from 'express';
import { getRecentActivity, getStats, clearLog } from '../services/debugLog.js';

const router = express.Router();

// Get recent activity log
router.get('/activity', (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  const activity = getRecentActivity(limit);
  res.json(activity);
});

// Get stats summary
router.get('/stats', (req, res) => {
  const stats = getStats();
  res.json(stats);
});

// Get both activity and stats
router.get('/', (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  res.json({
    stats: getStats(),
    activity: getRecentActivity(limit)
  });
});

// Clear the log
router.post('/clear', (req, res) => {
  clearLog();
  res.json({ success: true, message: 'Log cleared' });
});

// Check environment configuration (without exposing secrets)
router.get('/config', (req, res) => {
  res.json({
    anthropicKey: process.env.ANTHROPIC_API_KEY ? '✅ Set' : '❌ Missing',
    openaiKey: process.env.OPENAI_API_KEY ? '✅ Set' : '❌ Missing',
    cloudinaryName: process.env.CLOUDINARY_CLOUD_NAME ? '✅ Set' : '❌ Missing',
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY ? '✅ Set' : '❌ Missing',
    cloudinarySecret: process.env.CLOUDINARY_API_SECRET ? '✅ Set' : '❌ Missing',
    facultyPassword: process.env.FACULTY_PASSWORD ? '✅ Set' : '❌ Missing'
  });
});

export default router;
