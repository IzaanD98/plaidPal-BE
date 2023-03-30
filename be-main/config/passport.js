const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../db/model/UserModel");

module.exports = function (passport) {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id)
      .then((user) => {
        done(null, user);
      })
      .catch((error) => {
        done(error, null);
      });
  });

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:9090/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ googleId: profile.id });

          if (!user) {
            user = await User.create({
              googleId: profile.id,
              displayName: profile.displayName,
              email: profile.emails[0].value,
              photo: profile.photos[0].value,
              googleAccessToken: accessToken,
            });
          }
          done(null, user);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );
};

// "cookie-parser": "^1.4.6",
// "cookie-session": "^2.0.0",
// "cors": "^2.8.5",
// "dotenv": "^16.0.3",
// "express": "^4.18.2",
// "express-session": "^1.17.3",
// "mongoose": "^7.0.3",
// "morgan": "^1.10.0",
// "passport": "^0.6.0",
// "passport-google-oauth20": "^2.0.0",
// "plaid": "^13.0.0"
