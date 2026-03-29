const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// Serialize user into the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

/**
 * Configure Google Strategy
 */
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'PLACEHOLDER_ID',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'PLACEHOLDER_SECRET',
    callbackURL: "http://localhost:5000/api/auth/google/callback",
    proxy: true
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists
      let user = await User.findOne({ googleId: profile.id });

      if (user) {
        return done(null, user);
      }

      // If not, create a new user
      user = new User({
        googleId: profile.id,
        userID: profile.id, // Absolute unique ID for real tracing
        username: profile.emails[0].value.split('@')[0],
        displayName: profile.displayName,
        email: profile.emails[0].value,
        avatar: profile.photos[0].value
      });

      await user.save();
      done(null, user);
    } catch (err) {
      console.error('❌ Passport Error:', err);
      done(err, null);
    }
  }
));

module.exports = passport;
