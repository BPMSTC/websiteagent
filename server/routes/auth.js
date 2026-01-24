import express from 'express';

const router = express.Router();

router.post('/verify', (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'Password required' });
  }

  if (password === process.env.FACULTY_PASSWORD) {
    return res.json({ success: true });
  }

  return res.status(401).json({ error: 'Invalid password' });
});

export default router;
