const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Article', 'Tutorial', 'Lecture', 'Documentation', 'Tool', 'Course'],
    default: 'Documentation'
  },
  tags: [String], // Keywords for matching (e.g., 'java', 'dsa', 'react')
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Resource', ResourceSchema);
