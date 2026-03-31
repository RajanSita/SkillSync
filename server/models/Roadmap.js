const mongoose = require('mongoose');

const RoadmapSchema = new mongoose.Schema({
  title: String,
  skill: String,
  userID: String,
  motive: String,
  totalTime: String,
  dailyTime: String,
  materialPreferences: [String],
  tasks: [{
    taskId: Number,
    week: { type: Number, default: 1 },
    parentId: { type: Number, default: 0 }, // 0 for root nodes
    theme: String,
    description: String,
    resumeBullet: String,
    status: {
      type: String,
      enum: ['Pending', 'Completed'],
      default: 'Pending'
    },
    matchedResources: [{
      title: { type: String },
      url: { type: String },
      type: { type: String }
    }]
  }],
  totalWeeks: Number,
  totalTasks: Number,
  completedTasks: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Roadmap', RoadmapSchema);
