//passport is middlware

var GoogleStrategy = require("passport-google-oauth20").Strategy;

const passport = require("passport");
const userModel = require("../models/users");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/v1/oauth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // console.log(profile.photos[0].value);
        // console.log(profile.emails[0].value);
        // console.log(profile.displayName);

        const profilePic = profile.photos[0].value;
        const googleId = profile.id;
        const profileEmail = profile.emails[0].value;
        const profiledisplayName = profile.displayName;

        //check if user loggin using oauth before
        const currUser = await userModel.findOne({ googleId: profile.id });

        if (currUser) {
          //check if user already register using password
          const targetUser = await userModel.findOne({ email: profileEmail });

          //update existing user
          if (targetUser) {
            targetUser.googleId = googleId;
            targetUser.name = profiledisplayName;
            targetUser.profileImageUrl = profilePic;

            await targetUser.save();
            done(null, currUser);
          }
        } else {
          const newUser = new userModel({
            googleId,
            profileImageUrl: profilePic,
            name: profiledisplayName,
            email: profileEmail,
            isVerified: true,
            password: googleId,
          });

          await newUser.save();
          done(null, newUser);
        }
      } catch (error) {
        console.log(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  // console.log("Serializing user:", user);
  done(null, user.id);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
