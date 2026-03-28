const mongoose = require('mongoose');

const RoadmapSchema = new mongoose.Schema({
  title: String,
  skill: String,
  userID: String,
  tasks: [{
    taskId: Number,
    week: Number,
    theme: String,
    description: String,
    link: String,
    status: {
      type: String,
      enum: ['Pending', 'Completed'],
      default: 'Pending'
    }
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
