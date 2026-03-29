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
  secret: process.env.SESSION_SECRET || 'skillsync_secret_key_888',
  resave: true, // Forces session to be saved back to the session store
  saveUninitialized: false,
  rolling: true, // Force a session identifier cookie to be set on every response
  store: MongoStore.create({ 
    mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/skillsync',
    collectionName: 'sessions',
    ttl: 14 * 24 * 60 * 60 // 14 days
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    secure: false, // Set to true ONLY if using HTTPS
    httpOnly: true,
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
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
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
 * Middleware to check authentication
 */
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Authentication required to generate roadmaps' });
};

/**
 * Generate a new roadmap via local AI (Ollama/TinyDolphin)
 * Restricted to logged-in users only for real tracing.
 */
app.post('/api/roadmaps/generate', isAuthenticated, async (req, res) => {
  const { skill, goal, level, weeks } = req.body;
  const user = req.user; // Guaranteed to exist by isAuthenticated middleware

  try {
    console.log(`🎯 Generation requested by Authenticated User: ${user.displayName} (${user.userID})`);
    
    // 1. Generate roadmap via local AI (Ollama)
    const aiResponse = await AIService.generateRoadmap({ skill, goal, level, weeks });

    // 2. Create and Save Roadmap object tied to the unique Google ID
    const newRoadmap = new Roadmap({
      title: aiResponse.title || `${skill} Roadmap`,
      skill: aiResponse.skill || skill,
      userID: user.userID, // Unified ID for perfect tracing
      tasks: aiResponse.tasks || [],
      totalWeeks: aiResponse.totalWeeks || weeks,
      totalTasks: aiResponse.tasks ? aiResponse.tasks.length : 0,
      completedTasks: 0
    });

    await newRoadmap.save();
    console.log(`✅ Saved new synchronized AI roadmap for ${user.userID} to MongoDB.`);

    res.status(201).json(newRoadmap);

  } catch (error) {
    console.error('❌ Roadmap Generation API Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Fetch all roadmaps for a user (Identity-Aware)
 */
app.get('/api/roadmaps/:userId', async (req, res) => {
  try {
    const requestedId = req.params.userId;
    
    // 1. Find the user first to identify all their possible IDs
    const user = await User.findOne({ googleId: requestedId }) || await User.findOne({ userID: requestedId });
    
    // 2. Build a list of searchable IDs (googleId, internal userID, and the original requestedId)
    const searchIds = [requestedId];
    if (user) {
      if (user.googleId) searchIds.push(user.googleId);
      if (user.userID) searchIds.push(user.userID);
    }

    // 3. Find all roadmaps matching ANY of these IDs, sorted by newest first
    const roadmaps = await Roadmap.find({ userID: { $in: [...new Set(searchIds)] } }).sort({ createdAt: -1 });
    
    console.log(`📊 Found ${roadmaps.length} roadmaps for identity: ${requestedId}`);
    res.json(roadmaps);
  } catch (error) {
    console.error('❌ Roadmap fetch error:', error.message);
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
