const mongoose = require('mongoose');
const Resource = require('./models/Resource');
const dotenv = require('dotenv');

dotenv.config();

const resources = [
  // Web Development
  {
    title: 'MDN Web Docs - HTML & CSS',
    url: 'https://developer.mozilla.org/en-US/docs/Learn',
    type: 'Documentation',
    tags: ['web', 'html', 'css', 'frontend'],
    difficulty: 'Beginner'
  },
  {
    title: 'React Official Documentation',
    url: 'https://react.dev/learn',
    type: 'Documentation',
    tags: ['web', 'react', 'javascript', 'frontend'],
    difficulty: 'Intermediate'
  },
  {
    title: 'FreeCodeCamp - Responsive Web Design',
    url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/',
    type: 'Tutorial',
    tags: ['web', 'html', 'css', 'frontend'],
    difficulty: 'Beginner'
  },

  // App Development
  {
    title: 'Android Developers - Basics in Kotlin',
    url: 'https://developer.android.com/courses/android-basics-kotlin/course',
    type: 'Course',
    tags: ['app', 'android', 'kotlin', 'mobile'],
    difficulty: 'Beginner'
  },
  {
    title: 'Flutter Documentation - Get Started',
    url: 'https://docs.flutter.dev/get-started',
    type: 'Documentation',
    tags: ['app', 'flutter', 'dart', 'mobile'],
    difficulty: 'Intermediate'
  },

  // AI/ML
  {
    title: 'Machine Learning by Andrew Ng (Coursera)',
    url: 'https://www.coursera.org/specializations/machine-learning-introduction',
    type: 'Lecture',
    tags: ['ai', 'ml', 'python', 'math'],
    difficulty: 'Beginner'
  },
  {
    title: 'Scikit-learn User Guide',
    url: 'https://scikit-learn.org/stable/user_guide.html',
    type: 'Documentation',
    tags: ['ai', 'ml', 'python', 'data-science'],
    difficulty: 'Intermediate'
  },

  // Data Science
  {
    title: 'Pandas Documentation - Getting Started',
    url: 'https://pandas.pydata.org/docs/getting_started/index.html',
    type: 'Documentation',
    tags: ['data-science', 'python', 'analytics'],
    difficulty: 'Beginner'
  },
  {
    title: 'Kaggle Learn - Data Visualization',
    url: 'https://www.kaggle.com/learn/data-visualization',
    type: 'Tutorial',
    tags: ['data-science', 'python', 'visualization'],
    difficulty: 'Intermediate'
  },

  // DSA (C/C++/Java)
  {
    title: "Striver's A2Z DSA Sheet",
    url: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/',
    type: 'Tutorial',
    tags: ['dsa', 'c++', 'java', 'algorithm'],
    difficulty: 'Intermediate'
  },
  {
    title: 'GeeksforGeeks - Data Structures',
    url: 'https://www.geeksforgeeks.org/data-structures/',
    type: 'Documentation',
    tags: ['dsa', 'c', 'c++', 'java', 'algorithm'],
    difficulty: 'Beginner'
  },
  {
    title: 'LeetCode - Explore Card (Arrays/Strings)',
    url: 'https://leetcode.com/explore/',
    type: 'Tool',
    tags: ['dsa', 'interview', 'problem-solving'],
    difficulty: 'Intermediate'
  },

  // Java Development
  {
    title: 'Baeldung - Java Guides',
    url: 'https://www.baeldung.com/get-started-with-java',
    type: 'Article',
    tags: ['java', 'backend', 'oop'],
    difficulty: 'Beginner'
  },
  {
    title: 'Spring Boot Reference Guide',
    url: 'https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/',
    type: 'Documentation',
    tags: ['java', 'spring-boot', 'backend'],
    difficulty: 'Advanced'
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skillsync');
    console.log('✅ Connected to MongoDB for seeding...');
    
    await Resource.deleteMany({});
    console.log('🗑️ Existing resources cleared.');
    
    await Resource.insertMany(resources);
    console.log(`🚀 Seeded ${resources.length} curated resources!`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
};

seedDB();
