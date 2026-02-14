import express from 'express';
import User from '../models/User.js';
import { auth, authorize } from '../middleware/auth.js';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';

const router = express.Router();

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Cloudinary storage for avatars
const avatarStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'smartmind/avatars',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 300, height: 300, crop: 'fill', gravity: 'face' }],
    resource_type: 'auto'
  }
});

const uploadAvatar = multer({ 
  storage: avatarStorage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Get all users (Admin only)
router.get('/', auth, authorize('admin'), async (req, res) => {
  try {
    const { role, status } = req.query;
    let query = {};
    
    if (role) query.role = role;
    if (status) query.status = status;

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get pending users (Admin only)
router.get('/pending', auth, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find({ status: 'pending' }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get tutors (for learner view)
router.get('/tutors', auth, async (req, res) => {
  try {
    const tutors = await User.find({ role: 'tutor', status: 'approved' }).select('-password');
    res.json(tutors);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single user
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user status (Admin only)
router.put('/:id/status', auth, authorize('admin'), async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.status = status;
    await user.save();

    res.json({ 
      message: `User ${status} successfully`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user profile
router.put('/:id', auth, async (req, res) => {
  try {
    // Users can update their own profile, admin can update anyone
    if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { name, email, phone, bio, avatar } = req.body;
    const updateData = {};
    
    if (name) updateData.name = name;
    if (email) {
      // Check if email already exists
      const existingUser = await User.findOne({ email, _id: { $ne: req.params.id } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      updateData.email = email;
    }
    if (phone) updateData.phone = phone;
    if (bio) updateData.bio = bio;
    if (avatar) updateData.avatar = avatar;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Change password
router.put('/:id/password', auth, async (req, res) => {
  try {
    // Users can only change their own password
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Upload avatar
router.post('/avatar', auth, uploadAvatar.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const avatarUrl = req.file.path;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: avatarUrl },
      { new: true }
    ).select('-password');

    res.json({ 
      message: 'Avatar updated successfully', 
      avatar: user.avatar,
      user 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error uploading avatar', error: error.message });
  }
});

// Delete user (Admin only)
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent deleting other admins
    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot delete admin users' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin endpoint: Generate password reset code for a user
router.post('/:id/generate-reset-code', auth, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate 6-digit code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Hash the code
    const crypto = await import('crypto');
    const hashedCode = crypto.createHash('sha256').update(resetCode).digest('hex');
    
    // Set expiry to 30 minutes from now
    const expiryTime = new Date(Date.now() + 30 * 60 * 1000);

    // Update user with reset code
    user.resetCode = hashedCode;
    user.resetCodeExpiry = expiryTime;
    await user.save();

    res.json({ 
      message: 'Reset code generated successfully',
      resetCode,
      expiresIn: '30 minutes',
      userEmail: user.email
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin endpoint: Send password reset email to user
router.post('/:id/send-password-reset-email', auth, authorize('admin'), async (req, res) => {
  try {
    const { resetCode } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // In production, use Brevo or another email service
    // For now, just confirm the request was processed
    // The email sending would happen here if configured
    
    res.json({ 
      message: `Password reset instructions sent to ${user.email}`,
      note: 'Configure Brevo or email service to send actual emails'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;

