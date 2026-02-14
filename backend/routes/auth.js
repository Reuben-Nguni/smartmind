import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Validate role
    const validRoles = ['tutor', 'learner'];
    const userRole = validRoles.includes(role) ? role : 'learner';

    // Create user
    const user = new User({
      name,
      email,
      password,
      role: userRole,
      status: 'pending' // All users start as pending
    });

    await user.save();

    res.status(201).json({
      message: 'Registration successful. Please wait for admin approval.',
      user: {
        _id: user._id,
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

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check status
    if (user.status !== 'approved') {
      return res.status(403).json({ 
        message: `Your account is ${user.status}. Please wait for admin approval.` 
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Forgot Password - Send reset code
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists (security best practice)
      return res.status(200).json({ 
        message: 'If an account exists, a reset code will be sent to your email' 
      });
    }

    // Generate 6-digit reset code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Hash code for storage
    const hashedCode = crypto.createHash('sha256').update(resetCode).digest('hex');

    // Store reset code with 30-minute expiration
    user.resetCode = hashedCode;
    user.resetCodeExpiry = Date.now() + 30 * 60 * 1000; // 30 minutes
    await user.save();

    // TODO: Send email with reset code
    // For now, log it (in production, use Nodemailer or email service)
    console.log(`Reset code for ${email}: ${resetCode}`);

    res.json({ 
      message: 'Reset code sent to your email',
      // Remove this in production - only for testing
      testCode: process.env.NODE_ENV === 'development' ? resetCode : undefined
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Verify Reset Code
router.post('/verify-reset-code', async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: 'Email and code are required' });
    }

    const user = await User.findOne({ email });
    if (!user || !user.resetCode) {
      return res.status(400).json({ message: 'Invalid or expired code' });
    }

    // Check expiration
    if (Date.now() > user.resetCodeExpiry) {
      user.resetCode = undefined;
      user.resetCodeExpiry = undefined;
      await user.save();
      return res.status(400).json({ message: 'Code has expired' });
    }

    // Verify code
    const hashedCode = crypto.createHash('sha256').update(code).digest('hex');
    if (hashedCode !== user.resetCode) {
      return res.status(400).json({ message: 'Invalid code' });
    }

    res.json({ message: 'Code verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({ message: 'Email, code, and password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const user = await User.findOne({ email });
    if (!user || !user.resetCode) {
      return res.status(400).json({ message: 'Invalid request' });
    }

    // Check expiration
    if (Date.now() > user.resetCodeExpiry) {
      user.resetCode = undefined;
      user.resetCodeExpiry = undefined;
      await user.save();
      return res.status(400).json({ message: 'Code has expired' });
    }

    // Verify code
    const hashedCode = crypto.createHash('sha256').update(code).digest('hex');
    if (hashedCode !== user.resetCode) {
      return res.status(400).json({ message: 'Invalid code' });
    }

    // Update password
    user.password = newPassword;
    user.resetCode = undefined;
    user.resetCodeExpiry = undefined;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;

