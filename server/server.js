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
const AIService = require('./services/aiService');

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
 * Generate a new roadmap via local AI (Ollama/TinyDolphin)
 */
app.post('/api/roadmaps/generate', async (req, res) => {
  const { skill, goal, level, weeks, userID, username, email } = req.body;

  try {
    // 1. Ensure User exists or create new one
    let user = await User.findOne({ googleId: userID }) || await User.findOne({ userID });
    
    // If user doesn't exist yet, we can create one if we have minimal data
    if (!user && username) {
      console.log(`👤 Creating new user record in DB: ${username}`);
      user = new User({ userID, username, email });
      await user.save();
    }

    // 2. Generate roadmap via local AI (Ollama)
    const aiResponse = await AIService.generateRoadmap({ skill, goal, level, weeks });

    // 3. Create and Save Roadmap object
    const newRoadmap = new Roadmap({
      title: aiResponse.title || `${skill} Roadmap`,
      skill: aiResponse.skill || skill,
      userID: user ? user.userID : (userID || 'guest'),
      tasks: aiResponse.tasks || [],
      totalWeeks: aiResponse.totalWeeks || weeks,
      totalTasks: aiResponse.tasks ? aiResponse.tasks.length : 0,
      completedTasks: 0
    });

    await newRoadmap.save();
    console.log(`✅ Saved new AI roadmap for ${userID} to MongoDB.`);

    res.status(201).json(newRoadmap);

  } catch (error) {
    console.error('❌ Roadmap Generation API Error:', error.message);
    res.status(500).json({ error: error.message });
  }
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

/**
 * Fetch a user's profile and their most recent skill
 */
app.get('/api/users/:userId', async (req, res) => {
  try {
    const user = await User.findOne({ googleId: req.params.userId }) || await User.findOne({ userID: req.params.userId });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Fetch the most recent roadmap to get the user's current skill
    const latestRoadmap = await Roadmap.findOne({ userID: user.userID }).sort({ createdAt: -1 });
    
    res.json({
      ...user._doc,
      skill: latestRoadmap ? latestRoadmap.skill : null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Update user profile (Username/DisplayName)
 */
app.patch('/api/users/:userId', async (req, res) => {
  try {
    const { username, displayName } = req.body;
    const user = await User.findOne({ googleId: req.params.userId }) || await User.findOne({ userID: req.params.userId });
    
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (username) user.username = username;
    if (displayName) user.displayName = displayName;
    
    await user.save();
    console.log(`👤 Updated profile for ${user.userID}: ${user.username}`);
    res.json(user);
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
