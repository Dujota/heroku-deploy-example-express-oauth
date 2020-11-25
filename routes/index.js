const router = require('express').Router();
const passport = require('passport');

// The root route renders our only view
router.get('/', function(req, res) {
  res.redirect('/students');
});

// AUTH ROUTES

// Google OAuth login route
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] })); // tell passport to attempt to sign person in and use the google strategy, which returns the data specified in the scope object

// Google OAuth callback route
router.get(
  '/oauth2callback',
  passport.authenticate('google', { successRedirect: '/students', failureRedirect: '/students' })
);

// Oauth Logout Route
router.get('/logout', (req, res) => {
  req.logout(); // the logout method is provided by passport attached to the req obj
  res.redirect('/students');
});

module.exports = router;
