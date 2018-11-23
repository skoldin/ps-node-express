const passport = require('passport');
const { Strategy } = require('passport-local');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:local.strategy');

// a strategy is how we deal with username and password
// and how we identify that as a user
module.exports = function localStrategy() {
  passport.use(new Strategy(
    {
      usernameField: 'username', // it will use fields names to pull out that data
      passwordField: 'password'
    }, (username, password, done) => {
      const url = 'mongodb://localhost:27017';
      const dbName = 'libraryApp';

      (async function addUser() {
        let client;
        try {
          client = await MongoClient.connect(url, { useNewUrlParser: true });

          const db = client.db(dbName);
          const col = db.collection('users');

          const user = await col.findOne({ username });

          if (user.password === password) {
            done(null, user);
          } else {
            // we pass null because it did not error, just failed
            done(null, false);
          }
        } catch (e) {
          debug(e.stack);
        }

        client.close();
      }());
    }
  ));
};
