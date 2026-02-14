import express from 'express';
import { auth, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get lessons for tutor
router.get('/tutor', auth, async (req, res) => {
  try {
    if (req.user.role !== 'tutor') {
      return res.status(403).json({ message: 'Only tutors can access this endpoint' });
    }

    // Return empty array - lessons will be created when tutors schedule them
    res.json([]);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lessons', error: error.message });
  }
});

// Create new lesson (tutor only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'tutor') {
      return res.status(403).json({ message: 'Only tutors can create lessons' });
    }

    const { courseId, title, description, scheduledDate } = req.body;

    // Validate required fields
    if (!courseId || !title || !scheduledDate) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // In production: save to database
    const newLesson = {
      _id: Date.now().toString(),
      courseId,
      title,
      description,
      scheduledDate: new Date(scheduledDate),
      tutorId: req.user._id,
      status: 'scheduled',
      createdAt: new Date()
    };

    res.status(201).json({ message: 'Lesson created successfully', lesson: newLesson });
  } catch (error) {
    res.status(500).json({ message: 'Error creating lesson', error: error.message });
  }
});

// Update lesson status (start live, mark completed, etc.)
router.put('/:id/status', auth, async (req, res) => {
  try {
    if (req.user.role !== 'tutor') {
      return res.status(403).json({ message: 'Only tutors can update lessons' });
    }

    const { id } = req.params;
    const { status } = req.body; // 'scheduled', 'live', 'completed'

    // Validate status
    const validStatuses = ['scheduled', 'live', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    // In production: update in database
    res.json({
      message: 'Lesson status updated successfully',
      lessonId: id,
      newStatus: status
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating lesson', error: error.message });
  }
});

// Delete lesson
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'tutor') {
      return res.status(403).json({ message: 'Only tutors can delete lessons' });
    }

    const { id } = req.params;

    // In production: delete from database
    res.json({ message: 'Lesson deleted successfully', lessonId: id });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting lesson', error: error.message });
  }
});

export default router;
