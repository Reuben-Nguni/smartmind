import mongoose from 'mongoose';
import dotenv from 'dotenv';
// passwords are provided in plain text so the User model's pre-save
// hook will hash them once. Avoid double-hashing by not pre-hashing here.
import User from './models/User.js';
import Course from './models/Course.js';
import Enrollment from './models/Enrollment.js';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Course.deleteMany({});
    await Enrollment.deleteMany({});
    console.log('Cleared existing data');

    // Create Admin
    const adminPassword = 'admin123';
    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@smartmind.com',
      password: adminPassword,
      role: 'admin',
      status: 'approved',
      profileImage: 'https://ui-avatars.com/api/?name=System+Admin&background=667eea&color=fff&size=200'
    });
    console.log('✅ Admin created: admin@smartmind.com / admin123');

    // Create Tutors
    const tutorPassword = 'tutor123';
    
    const tutor1 = await User.create({
      name: 'Dr. Sarah Johnson',
      email: 'tutor@smartmind.com',
      password: tutorPassword,
      role: 'tutor',
      status: 'approved',
      profileImage: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=764ba2&color=fff&size=200'
    });

    const tutor2 = await User.create({
      name: 'Michael Chen',
      email: 'michael@smartmind.com',
      password: tutorPassword,
      role: 'tutor',
      status: 'approved',
      profileImage: 'https://ui-avatars.com/api/?name=Michael+Chen&background=10b981&color=fff&size=200'
    });

    const tutor3 = await User.create({
      name: 'Emily Williams',
      email: 'emily@smartmind.com',
      password: tutorPassword,
      role: 'tutor',
      status: 'approved',
      profileImage: 'https://ui-avatars.com/api/?name=Emily+Williams&background=f59e0b&color=fff&size=200'
    });
    console.log('✅ Tutors created');

    // Create Learners
    const learnerPassword = 'learner123';
    
    const learners = await User.insertMany([
      {
        name: 'John Smith',
        email: 'john@smartmind.com',
        password: learnerPassword,
        role: 'learner',
        status: 'approved',
        profileImage: 'https://ui-avatars.com/api/?name=John+Smith&background=667eea&color=fff&size=200'
      },
      {
        name: 'Maria Garcia',
        email: 'maria@smartmind.com',
        password: learnerPassword,
        role: 'learner',
        status: 'approved',
        profileImage: 'https://ui-avatars.com/api/?name=Maria+Garcia&background=ec4899&color=fff&size=200'
      },
      {
        name: 'David Kim',
        email: 'david@smartmind.com',
        password: learnerPassword,
        role: 'learner',
        status: 'approved',
        profileImage: 'https://ui-avatars.com/api/?name=David+Kim&background=06b6d4&color=fff&size=200'
      },
      {
        name: 'Lisa Wang',
        email: 'lisa@smartmind.com',
        password: learnerPassword,
        role: 'learner',
        status: 'pending',
        profileImage: 'https://ui-avatars.com/api/?name=Lisa+Wang&background=8b5cf6&color=fff&size=200'
      },
      {
        name: 'James Brown',
        email: 'james@smartmind.com',
        password: learnerPassword,
        role: 'learner',
        status: 'rejected',
        profileImage: 'https://ui-avatars.com/api/?name=James+Brown&background=ef4444&color=fff&size=200'
      }
    ]);
    console.log('✅ Learners created');

    // Create Sample Courses
    const courses = await Course.insertMany([
      {
        title: 'Complete Web Development Bootcamp',
        description: 'Learn HTML, CSS, JavaScript, React, Node.js and more. This comprehensive course takes you from beginner to professional web developer.',
        tutor: tutor1._id,
        category: 'Web Development',
        thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800',
        isPublished: true,
        modules: [
          { title: 'Introduction to HTML', description: 'Learn the basics of HTML5', order: 1 },
          { title: 'CSS Fundamentals', description: 'Styling with CSS3', order: 2 },
          { title: 'JavaScript Basics', description: 'Programming fundamentals', order: 3 },
          { title: 'React.js', description: 'Building modern UIs', order: 4 },
          { title: 'Node.js & Express', description: 'Backend development', order: 5 }
        ],
        materials: [
          { title: 'Course Syllabus', type: 'pdf', url: 'https://example.com/syllabus.pdf' },
          { title: 'Project Files', type: 'link', url: 'https://example.com/projects.zip' }
        ],
        assignments: [
          {
            title: 'Build a Portfolio Website',
            description: 'Create a personal portfolio using HTML, CSS, and JavaScript',
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
          }
        ],
        announcements: [
          {
            title: 'Welcome to the Course!',
            content: 'Welcome everyone! This course will transform you into a professional web developer.'
          }
        ],
        enrolledStudents: [learners[0]._id, learners[1]._id]
      },
      {
        title: 'Python for Data Science',
        description: 'Master Python programming and data analysis. Learn pandas, numpy, matplotlib, and machine learning fundamentals.',
        tutor: tutor2._id,
        category: 'Data Science',
        thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800',
        isPublished: true,
        modules: [
          { title: 'Python Fundamentals', description: 'Basic Python syntax and concepts', order: 1 },
          { title: 'Data Structures', description: 'Lists, dictionaries, sets', order: 2 },
          { title: 'NumPy', description: 'Numerical computing', order: 3 },
          { title: 'Pandas', description: 'Data manipulation', order: 4 },
          { title: 'Data Visualization', description: 'Matplotlib and Seaborn', order: 5 },
          { title: 'Machine Learning', description: 'Introduction to ML', order: 6 }
        ],
        materials: [
          { title: 'Python Cheat Sheet', type: 'pdf', url: 'https://example.com/python-cheatsheet.pdf' }
        ],
        assignments: [
          {
            title: 'Data Analysis Project',
            description: 'Analyze a real dataset and present insights',
            dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000)
          }
        ],
        enrolledStudents: [learners[0]._id, learners[2]._id]
      },
      {
        title: 'Mobile App Development with React Native',
        description: 'Build cross-platform mobile apps for iOS and Android using React Native and Expo.',
        tutor: tutor3._id,
        category: 'Mobile Development',
        thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
        isPublished: true,
        modules: [
          { title: 'Getting Started', description: 'Setup and environment', order: 1 },
          { title: 'React Native Basics', description: 'Components and styling', order: 2 },
          { title: 'Navigation', description: 'React Navigation', order: 3 },
          { title: 'State Management', description: 'Redux and Context API', order: 4 },
          { title: 'APIs & Backend', description: 'Fetching data', order: 5 }
        ],
        materials: [],
        assignments: [],
        announcements: [
          {
            title: 'New Course Available!',
            content: 'Start building mobile apps today.'
          }
        ],
        enrolledStudents: []
      },
      {
        title: 'UI/UX Design Masterclass',
        description: 'Learn professional UI/UX design principles using Figma. Create stunning user interfaces.',
        tutor: tutor1._id,
        category: 'Design',
        thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
        isPublished: true,
        modules: [
          { title: 'Design Principles', description: 'Color, typography, layout', order: 1 },
          { title: 'Figma Basics', description: 'Interface and tools', order: 2 },
          { title: 'Prototyping', description: 'Creating interactive prototypes', order: 3 },
          { title: 'User Research', description: 'Understanding users', order: 4 }
        ],
        materials: [
          { title: 'Design Resources', type: 'link', url: 'https://example.com/resources' }
        ],
        assignments: [],
        enrolledStudents: [learners[1]._id]
      },
      {
        title: 'Cloud Computing with AWS',
        description: 'Master Amazon Web Services. Learn EC2, S3, Lambda, and more cloud technologies.',
        tutor: tutor2._id,
        category: 'Cloud Computing',
        thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
        isPublished: true,
        modules: [
          { title: 'AWS Introduction', description: 'Cloud fundamentals', order: 1 },
          { title: 'EC2 & Compute', description: 'Virtual servers', order: 2 },
          { title: 'Storage with S3', description: 'Object storage', order: 3 },
          { title: 'Serverless', description: 'AWS Lambda', order: 4 }
        ],
        materials: [],
        assignments: [],
        enrolledStudents: []
      },
      {
        title: 'DevOps & CI/CD',
        description: 'Learn Docker, Kubernetes, Jenkins, and modern DevOps practices.',
        tutor: tutor3._id,
        category: 'DevOps',
        thumbnail: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800',
        isPublished: false,
        modules: [
          { title: 'Docker Basics', description: 'Containerization', order: 1 },
          { title: 'Kubernetes', description: 'Container orchestration', order: 2 }
        ],
        materials: [],
        assignments: [],
        enrolledStudents: []
      }
    ]);
    console.log('✅ Courses created');

    // Create Enrollments
    await Enrollment.insertMany([
      {
        learnerId: learners[0]._id,
        courseId: courses[0]._id,
        status: 'approved',
        approvedAt: new Date()
      },
      {
        learnerId: learners[1]._id,
        courseId: courses[0]._id,
        status: 'approved',
        approvedAt: new Date()
      },
      {
        learnerId: learners[0]._id,
        courseId: courses[1]._id,
        status: 'approved',
        approvedAt: new Date()
      },
      {
        learnerId: learners[2]._id,
        courseId: courses[1]._id,
        status: 'pending'
      },
      {
        learnerId: learners[1]._id,
        courseId: courses[3]._id,
        status: 'approved',
        approvedAt: new Date()
      }
    ]);
    console.log('✅ Enrollments created');

    console.log('\n🎉 Seed data created successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('   Admin: admin@smartmind.com / admin123');
    console.log('   Tutor: tutor@smartmind.com / tutor123');
    console.log('   Learner: john@smartmind.com / learner123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();

