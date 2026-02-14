import express from 'express';
import Course from '../models/Course.js';
import { auth, authorize } from '../middleware/auth.js';
import { uploadImage, uploadPDF, uploadAny } from '../config/cloudinary.js';

const router = express.Router();

// Get all published courses
router.get('/', async (req, res) => {
  try {
    const { category, tutor } = req.query;
    let query = { isPublished: true };
    
    if (category) query.category = category;
    if (tutor) query.tutor = tutor;

    const courses = await Course.find(query)
      .populate('tutor', 'name email profileImage')
      .sort({ createdAt: -1 });
    
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get tutor's courses
router.get('/tutor/my-courses', auth, authorize('tutor', 'admin'), async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : { tutor: req.user._id };
    const courses = await Course.find(query)
      .populate('tutor', 'name email')
      .sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single course
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('tutor', 'name email profileImage')
      .populate('enrolledStudents', 'name email');
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create course (Tutor only)
router.post('/', auth, authorize('tutor'), async (req, res) => {
  try {
    const { title, description, category, thumbnail } = req.body;

    const course = new Course({
      title,
      description,
      category,
      thumbnail,
      tutor: req.user._id,
      isPublished: false
    });

    await course.save();
    
    const populatedCourse = await Course.findById(course._id)
      .populate('tutor', 'name email');

    res.status(201).json(populatedCourse);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update course (Tutor or Admin)
router.put('/:id', auth, authorize('tutor', 'admin'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Tutor can only update their own courses
    if (req.user.role === 'tutor' && course.tutor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { title, description, category, thumbnail, isPublished, modules } = req.body;
    
    if (title) course.title = title;
    if (description) course.description = description;
    if (category) course.category = category;
    if (thumbnail) course.thumbnail = thumbnail;
    if (isPublished !== undefined) course.isPublished = isPublished;
    if (modules) course.modules = modules;

    await course.save();
    
    const updatedCourse = await Course.findById(course._id)
      .populate('tutor', 'name email');

    res.json(updatedCourse);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add module to course
router.post('/:id/modules', auth, authorize('tutor', 'admin'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (req.user.role === 'tutor' && course.tutor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { title, description } = req.body;
    const newModule = {
      title,
      description,
      order: course.modules.length + 1
    };

    course.modules.push(newModule);
    await course.save();

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add material to course
router.post('/:id/materials', auth, authorize('tutor', 'admin'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (req.user.role === 'tutor' && course.tutor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { title, type, url } = req.body;
    
    course.materials.push({ title, type, url });
    await course.save();

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add announcement
router.post('/:id/announcements', auth, authorize('tutor', 'admin'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (req.user.role === 'tutor' && course.tutor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { title, content } = req.body;
    
    course.announcements.push({ title, content });
    await course.save();

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add assignment
router.post('/:id/assignments', auth, authorize('tutor', 'admin'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (req.user.role === 'tutor' && course.tutor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { title, description, dueDate, materials } = req.body;
    
    course.assignments.push({ title, description, dueDate, materials });
    await course.save();

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete course
router.delete('/:id', auth, authorize('tutor', 'admin'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (req.user.role === 'tutor' && course.tutor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;

