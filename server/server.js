const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configuration
const passport = require('passport');
const session = require('express-session');
const { MongoStore } = require('connect-mongo');
require('./config/passport'); // Import passport configuration

// Middleware
app.use(cors({ 
  origin: 'http://localhost:3000', 
  credentials: true 
}));
app.use(express.json());

// Session setup
app.use(session({
  secret: process.env.SESSION_SECRET || 'skillsync_secret_key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/skillsync' }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    secure: false, // Set to true if using HTTPS
    sameSite: 'lax'
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

const User = require('./models/User');
const Roadmap = require('./models/Roadmap');
// const AIService = require('./services/aiService');

// Auth Routes

/**
 * Trigger Google Auth
 */
app.get('/api/auth/google', 
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

/**
 * Handle Google Auth Callback
 */
app.get('/api/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: 'http://localhost:3000' }),
  (req, res) => {
    // Successful authentication, redirect to frontend dashboard
    res.redirect('http://localhost:3000');
  }
);

/**
 * Get current logged-in user
 */
app.get('/api/auth/current_user', (req, res) => {
  res.send(req.user);
});

/**
 * Logout
 */
app.get('/api/auth/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.redirect('http://localhost:3000');
  });
});

/**
 * Generate a new roadmap (Temporarily disabled - Waiting for Ollama setup)
 */
app.post('/api/roadmaps/generate', async (req, res) => {
  res.status(501).json({ message: "AI Roadmap generation is temporarily disabled. Set up Ollama to enable this feature." });
  /*
  const { skill, goal, level, weeks, userID, username, email } = req.body;

  try {
    // 1. Ensure User exists or create new one
    let user = await User.findOne({ userID });
    if (!user) {
      console.log(`👤 Creating new user record in DB: ${username}`);
      user = new User({ userID, username, email });
      await user.save();
    }

    // 2. Generate tasks via local AI
    const tasks = await AIService.generateRoadmap({ skill, goal, level, weeks });

    // 3. Create and Save Roadmap object
    const newRoadmap = new Roadmap({
      title: `${skill} Roadmap`,
      skill,
      userID,
      tasks,
      totalWeeks: weeks,
      totalTasks: tasks.length,
      completedTasks: 0
    });

    await newRoadmap.save();
    console.log(`✅ Saved new roadmap for ${userID} to MongoDB.`);

    res.status(201).json(newRoadmap);

  } catch (error) {
    console.error('❌ Roadmap Generation API Error:', error.message);
    res.status(500).json({ error: error.message });
  }
  */
});

/**
 * Fetch all roadmaps for a user
 */
app.get('/api/roadmaps/:userId', async (req, res) => {
  try {
    const roadmaps = await Roadmap.find({ userID: req.params.userId }).sort({ createdAt: -1 });
    res.json(roadmaps);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Update task status
 */
app.patch('/api/tasks/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const roadmap = await Roadmap.findOne({ "tasks._id": req.params.id });
    
    if (!roadmap) return res.status(404).json({ error: 'Task not found' });

    const task = roadmap.tasks.id(req.params.id);
    task.status = status;
    
    // Recalculate completed tasks count
    roadmap.completedTasks = roadmap.tasks.filter(t => t.status === 'Completed').length;
    
    await roadmap.save();
    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skillsync')
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ Failed to connect to MongoDB:', err));

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
