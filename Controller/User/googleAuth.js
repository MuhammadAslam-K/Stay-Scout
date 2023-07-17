import passport from "passport"
import jwt from "jsonwebtoken";
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from "../../model/userModel.js";
import dotenv from "dotenv"

dotenv.config({ path: "config.env" })



/////////// PASSWORD HASHIG//////

var email
let errorMessage;


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
                console.log(profile);
                if (existingUser) {


                    if ((existingUser.password === passport) && (existingUser.is_block === false)) {
                        console.log(35);
                        return done(null, existingUser);
                    }
                    // else if (existingUser.is_block === true) {
                    //     return done(new Error("Your Account is Blocked by the Admin Please Contact stayscout@gmail.com"), null)
                    // }
                    // else {
                    //     return done(new Error("Please log in with your existing account."), null)
                    // }
                    else if (existingUser.is_block === true) {
                        console.log(45);
                        errorMessage = "Your Account is Blocked by the Admin Please Contact stayscout@gmail.com";
                        return done(null, false);
                    } else {
                        console.log(49);
                        errorMessage = "Please log in with your existing account.";
                        return done(null, false);
                    }

                }

                const newUser = new User({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: passport,
                });

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
        console.log(errorMessage);
        if (errorMessage) {
            res.render('userRegister', { errorMessage });

        }

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