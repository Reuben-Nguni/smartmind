import express from 'express';
import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';
import { auth, authorize } from '../middleware/auth.js';

const router = express.Router();

// Enroll in a course (Learner)
router.post('/', auth, authorize('learner'), async (req, res) => {
  try {
    const { courseId } = req.body;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      learnerId: req.user._id,
      courseId
    });

    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Create enrollment
    const enrollment = new Enrollment({
      learnerId: req.user._id,
      courseId,
      status: 'pending'
    });

    await enrollment.save();

    const populatedEnrollment = await Enrollment.findById(enrollment._id)
      .populate('learnerId', 'name email')
      .populate('courseId', 'title category');

    res.status(201).json(populatedEnrollment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get learner's enrollments
router.get('/learner', auth, authorize('learner'), async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ learnerId: req.user._id })
      .populate('courseId', 'title description category thumbnail tutor')
      .populate({
        path: 'courseId',
        populate: {
          path: 'tutor',
          select: 'name email'
        }
      })
      .sort({ enrolledAt: -1 });
    
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get tutor's course enrollments
router.get('/tutor', auth, authorize('tutor'), async (req, res) => {
  try {
    // Find courses by tutor
    const courses = await Course.find({ tutor: req.user._id });
    const courseIds = courses.map(c => c._id);

    // Find enrollments for these courses
    const enrollments = await Enrollment.find({ 
      courseId: { $in: courseIds } 
    })
      .populate('learnerId', 'name email profileImage')
      .populate('courseId', 'title category')
      .sort({ enrolledAt: -1 });
    
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all enrollments (Admin)
router.get('/admin', auth, authorize('admin'), async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    
    if (status) query.status = status;

    const enrollments = await Enrollment.find(query)
      .populate('learnerId', 'name email')
      .populate('courseId', 'title category')
      .sort({ enrolledAt: -1 });
    
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update enrollment status (Tutor approves/rejects)
router.put('/:id/status', auth, authorize('tutor', 'admin'), async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const enrollment = await Enrollment.findById(req.params.id)
      .populate('courseId');
    
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    // Tutor can only approve enrollments for their own courses
    if (req.user.role === 'tutor' && 
        enrollment.courseId.tutor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    enrollment.status = status;
    if (status === 'approved') {
      enrollment.approvedAt = Date.now();
      
      // Add student to course
      await Course.findByIdAndUpdate(enrollment.courseId._id, {
        $addToSet: { enrolledStudents: enrollment.learnerId }
      });
    }

    await enrollment.save();

    const populatedEnrollment = await Enrollment.findById(enrollment._id)
      .populate('learnerId', 'name email')
      .populate('courseId', 'title category');

    res.json(populatedEnrollment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single enrollment
router.get('/:id', auth, async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id)
      .populate('learnerId', 'name email')
      .populate('courseId');
    
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    // Check authorization
    const isLearner = enrollment.learnerId._id.toString() === req.user._id.toString();
    const isTutor = enrollment.courseId.tutor.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isLearner && !isTutor && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;

