const passport = require('passport');
// put strategies into a different directory in case we will have many of these
require('./strategies/local.strategy')();

module.exports = function passportConfig(app) {
  // we need to inialize passport before using
  app.use(passport.initialize());
  // start session
  app.use(passport.session());

  // stores user in session. Accepts user and callback which accepts error and a thing
  passport.serializeUser((user, done) => {
    // the callback will save the user to session. We will not want to store whole user, just id
    done(null, user);
  });

  // retrieves user from session
  passport.deserializeUser((user, done) => {
    // find user in the DB by id
    done(null, user);
  });
};
