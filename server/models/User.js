const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: true,
    unique: true
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true // Allows for users created without Google initially
  },
  username: {
    type: String,
    required: true
  },
  displayName: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  avatar: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);
