import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";
import dotenv from 'dotenv';
dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const avatar = profile.photos[0]?.value;

        // Check if user already exists with this googleId
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          // Existing Google user — just return them
          return done(null, user);
        }

        // Check if email already registered locally
        user = await User.findOne({ email });

        if (user) {
          // Link Google to existing local account
          user.googleId = profile.id;
          user.avatar = avatar;
          user.authProvider = "google";
          await user.save();
          return done(null, user);
        }

        // Brand new user — create them
        user = await User.create({
          name: profile.displayName,
          email,
          googleId: profile.id,
          avatar,
          authProvider: "google",
          // no password field
        });

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

export default passport;