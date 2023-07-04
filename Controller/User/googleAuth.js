import passport from "passport"
import jwt from "jsonwebtoken";
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from "../../model/userModel.js";
import dotenv from "dotenv"

dotenv.config({ path: "config.env" })



/////////// PASSWORD HASHIG//////

var email

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {

            try {
                const existingUser = await User.findOne({ email: profile.emails[0].value })
                const passport = profile.id
                email = profile.emails[0].value
                console.log(existingUser);

                if (existingUser) {


                    if ((existingUser.password === passport) && (existingUser.is_block === false)) {
                        return done(null, existingUser);
                    }
                    else if (existingUser.is_block === true) {
                        return done(new Error("Your Account is Blocked by the Admin Please Contact stayscout@gmail.com"), null)
                    }
                    else {
                        return done(new Error("Please log in with your existing account."), null)
                    }
                }

                const newUser = new User({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: passport,
                });

                console.log(newUser);
                await newUser.save();

                done(null, newUser);
            } catch (error) {

                done(error, null);
            }
        }
    )
);

passport.serializeUser((user, done) => {

    done(null, user.id);
});


passport.deserializeUser(async (id, done) => {

    try {
        const user = await User.findById(id);

        done(null, user);
    } catch (err) {

        done(err, null);
    }
});

const googleSignup = passport.authenticate('google', { scope: ['profile', 'email'] })

const googleSuccess = (passport.authenticate('google', { failureRedirect: '/login' })
    , (req, res) => {

        const payload = { email: email };

        const token = jwt.sign(payload, process.env.SECRET_TOKEN, {
            expiresIn: "1h",
        })

        req.session.usertoken = token
        req.session.usertoken
        res.redirect('/');
    })


export default {
    googleSignup,
    googleSuccess,
}