const passport = require('passport');
const jwt = require('jsonwebtoken');
const { Strategy: JWTStrategy, ExtractJwt } = require('passport-jwt');
const Models = require('./models');
require('./passport');

let User = Models.User;

module.exports = (router) => {

  router.post('/login', (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
      console.log(err, user, info)
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.status(401).json({ message: info.message });
      }

      // Generate JWT token
      const token = jwt.sign({ sub: user._id }, '123456789');

      // Return the token as a response
      return res.json({ user, token });
    })(req, res, next);
  });

  passport.use(
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: '123456789',
      },
      (payload, done) => {
        // Check if the user exists in the database
        User.findById(payload.sub)
          .then(user => {
            if (user) {
              return done(null, user);
            } else {
              return done(null, false);
            }
          })
          .catch(err => done(err, false));
      }
    )
  );
}      