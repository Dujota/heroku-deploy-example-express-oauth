const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const Student = require('../models/student');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK,
    },
    // Called the verify function
    function(accessToken, refreshToken, profile, cb) {
      // cb belongs to Passport - signature is cb(error, user)
      // a user has logged in with OAuth...
      /**
       * In this callback we must:
       * Find the user from the database and provide them back to Passport by calling the cb callback method, or...
       *
       * If the user does not exist, we have a new user! We will add them to the database and pass along this new user in the cb callback method.
       *
       *
       *
       */
      Student.findOne({ googleId: profile.id })
        .then(existingStudent => {
          if (existingStudent) {
            return cb(null, existingStudent); // tells passport, sign in user, no error
          }

          const newStudent = new Student({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
          });

          newStudent
            .save()
            .then(() => cb(null, newStudent))
            .catch(err => cb(err));
        })
        .catch(err => cb(err));
    }
  )
);

// after the request finishes we encrypt the user
passport.serializeUser((student, done) => done(null, student.id));

// before each request we de-crypt the user
passport.deserializeUser((id, done) => {
  Student.findById(id)
    .then(student => done(null, student))
    .catch(err => done(err, null));
});
