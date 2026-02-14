import express from 'express';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get all notifications for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    // Return empty array - notifications will be created by the system when needed
    // For now, users have no notifications until the system creates them
    res.json([]);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
});

// Get announcements (for learners)
router.get('/announcements', auth, async (req, res) => {
  try {
    // Return empty array - announcements will be created by tutors/admins when needed
    res.json([]);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching announcements', error: error.message });
  }
});

export default router;
