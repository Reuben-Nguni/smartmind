import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema({
  learnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  enrolledAt: {
    type: Date,
    default: Date.now
  },
  approvedAt: {
    type: Date
  }
});

// Prevent duplicate enrollments
enrollmentSchema.index({ learnerId: 1, courseId: 1 }, { unique: true });

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

export default Enrollment;

