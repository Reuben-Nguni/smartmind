import express from 'express';
import { requireAuth, requireApproved } from '../middleware/auth.js';

const router = express.Router();

// Get all notifications for logged-in user
router.get('/', requireAuth, requireApproved, async (req, res) => {
  try {
    // Mock notifications - in production, fetch from database
    const mockNotifications = [
      {
        _id: '1',
        title: 'Course Updated',
        message: 'Your instructor updated the course material for React Basics',
        type: 'info',
        createdAt: new Date(Date.now() - 3600000), // 1 hour ago
      },
      {
        _id: '2',
        title: 'Assignment Due',
        message: 'Your assignment for JavaScript Advanced is due in 2 days',
        type: 'urgent',
        createdAt: new Date(Date.now() - 7200000), // 2 hours ago
      },
      {
        _id: '3',
        title: 'New Enrollment',
        message: 'Your enrollment request has been approved!',
        type: 'success',
        createdAt: new Date(Date.now() - 86400000), // 1 day ago
      },
      {
        _id: '4',
        title: 'Live Lesson Starting',
        message: 'Web Development live session starts in 30 minutes',
        type: 'info',
        createdAt: new Date(Date.now() - 1800000), // 30 minutes ago
      }
    ];

    res.json(mockNotifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
});

// Get announcements (for learners)
router.get('/announcements', requireAuth, requireApproved, async (req, res) => {
  try {
    // Mock announcements - in production, fetch from database
    const mockAnnouncements = [
      {
        _id: '1',
        courseTitle: 'React Basics',
        tutorName: 'John Doe',
        content: 'Welcome to React Basics! This course covers fundamentals of React library including components, hooks, and state management.',
        createdAt: new Date(Date.now() - 86400000),
      },
      {
        _id: '2',
        courseTitle: 'JavaScript Advanced',
        tutorName: 'Jane Smith',
        content: 'Important: Please review the async/await patterns before our live session next week. We will be building a real-time application.',
        createdAt: new Date(Date.now() - 172800000),
      },
      {
        _id: '3',
        courseTitle: 'Web Development',
        tutorName: 'Mike Johnson',
        content: 'Great progress everyone! Your projects are looking fantastic. Keep up the excellent work!',
        createdAt: new Date(Date.now() - 259200000),
      }
    ];

    res.json(mockAnnouncements);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching announcements', error: error.message });
  }
});

export default router;
