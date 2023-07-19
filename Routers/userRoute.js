import express from "express"
import jwt from 'jsonwebtoken'
import dotenv from "dotenv";
import passport from "passport";
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import loginController from "../Controller/User/userLogin.js"
import signupController from "../Controller/User/userSignup.js"
import passwordUpdation from "../Controller/User/passwordUpdation.js"
import hotelManagement from "../Controller/User/hotelManagement.js"
import roomManagement from "../Controller/User/roomManagement.js"
import booking from "../Controller/User/booking.js"
import contact from "../Controller/User/contact.js"
import userController from "../Controller/User/userController.js"
import auth from "../middleware/userAuthentication.js"
import User from "../model/userModel.js"


dotenv.config({ path: "config.env" });
const { isLogged, islogout, isBlocked } = auth
const user_route = express()
user_route.set("views", "./views/user");



/////////////USER AUTHENTICATION ROUTES//////////////

user_route.get("/login", islogout, loginController.login)
user_route.post("/login", islogout, loginController.loginVerify)
user_route.get("/logout", isLogged, loginController.logout)


user_route.get('/signup', islogout, signupController.signUp)
user_route.post('/signup', islogout, signupController.signupValidation)
user_route.get("/otp", islogout, signupController.enterOtp)
user_route.post("/submitOtp", islogout, signupController.verifyOtp)

/////////////PASSWORD RECOVERY////////

user_route.get("/passwordRecovery", islogout, passwordUpdation.enterEmail)
user_route.post("/emailValidate", islogout, passwordUpdation.emailValidation)
user_route.get("/recoverotp", islogout, passwordUpdation.recoveryotp)
user_route.post("/verifyotp", islogout, passwordUpdation.verifyOtp)
user_route.get("/updatePassword", islogout, passwordUpdation.updatePassword)
user_route.post("/updatePassword", islogout, passwordUpdation.passwordUpdation)


//////////USER HOME ROUTES/////////

user_route.get("/", userController.home)
user_route.get("/profile", isLogged, isBlocked, userController.profile)
user_route.post("/profile/edit", isLogged, isBlocked, userController.profile_edit)
user_route.get("/wallethistory", userController.walletHistory)


//////// HOTELS /////////////isLogged, isBlocked, 
user_route.get("/hotels", isLogged, isBlocked, hotelManagement.hotels)
user_route.get("/hotel/home", isLogged, isBlocked, hotelManagement.hotelHome)
user_route.post("/hotel/search", isLogged, isBlocked, hotelManagement.hotelSearch)
user_route.post("/hotel/checkin", isLogged, isBlocked, hotelManagement.roomAvailability)

//////////Rooms/////////////
user_route.get("/rooms", isLogged, isBlocked, roomManagement.rooms)
user_route.get("/hotel/room", isLogged, isBlocked, roomManagement.roomDetails)
user_route.get("/room/filter", isLogged, isBlocked, roomManagement.roomsFilter)

user_route.get("/room/checkin", isLogged, isBlocked, booking.roomcheckin)
user_route.post("/room/book", isLogged, isBlocked, booking.book)

/////////////CONTACT////////////
user_route.get("/contact", isLogged, isBlocked, contact.contact)
user_route.post("/contact", isLogged, isBlocked, contact.submitContact)


//////////////PAYMENT/////////
user_route.get("/payment", booking.payment)






/////// GOOGLE SIGNIN///////
var userData


user_route.get('/auth/google/signin', passport.authenticate('google', { scope: ['profile', 'email'] }));
user_route.get('/auth/google/signup', passport.authenticate('google', { scope: ['profile', 'email'] }))

user_route.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {

        const index = userData._id
        const payload = { index: index };
        const token = jwt.sign(payload, process.env.SECRET_TOKEN, {
            expiresIn: "1h",
        })

        req.session.usertoken = token
        req.session.user = userData

        res.redirect('/');
    }
);

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const existingUser = await User.findOne({ email: profile.emails[0].value });

                if (existingUser) {
                    return done(null, existingUser);
                }

                const newUser = new User({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: null,
                });

                const savedUser = await newUser.save();
                done(null, savedUser);
            } catch (error) {
                done(error, null);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    userData = user
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


export default user_route