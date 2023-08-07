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
import review from "../Controller/User/review.js"
import cancellation from "../Controller/User/cancellation.js";
import auth from "../middleware/userAuthentication.js"
import Signup_functions from "../helper/Signup_functions.js";
import User from "../model/userModel.js"


dotenv.config({ path: "config.env" });
const { isLogged, islogout, isBlocked } = auth
const user_route = express()
user_route.set("views", "./views/user");



// / / / / / / / / USER AUTHENTICATION / / / / / / / / 
user_route.get("/login", islogout, loginController.login)
user_route.post("/login", islogout, loginController.loginVerify)
user_route.get("/logout", isLogged, loginController.logout)

user_route.get("/emailveryfy", islogout, loginController.enterEmail)
user_route.post("/emailveryfy", islogout, loginController.emailVerfy)
user_route.get("/emailotp", islogout, loginController.recoveryotp)
user_route.post("/emailotp", islogout, loginController.verifyOtp)


user_route.get('/signup', islogout, signupController.signUp)
user_route.post('/signup', islogout, signupController.signupValidation)
user_route.get("/otp", islogout, signupController.enterOtp)
user_route.post("/submitOtp", islogout, signupController.verifyOtp)

// / / / / / / PASSWORD RECOVERY / / / / / / //
user_route.get("/passwordRecovery", islogout, passwordUpdation.enterEmail)
user_route.post("/emailValidate", islogout, passwordUpdation.emailValidation)
user_route.get("/recoverotp", islogout, passwordUpdation.recoveryotp)
user_route.post("/verifyotp", islogout, passwordUpdation.verifyOtp)
user_route.get("/updatePassword", islogout, passwordUpdation.updatePassword)
user_route.post("/updatePassword", islogout, passwordUpdation.passwordUpdation)


// / / / / / / USER HOME ROUTES / / / / // 
user_route.get("/", userController.home)
user_route.get("/profile", isLogged, isBlocked, userController.profile)
user_route.post("/profile/edit", isLogged, isBlocked, userController.profile_edit)
user_route.get("/wallethistory", isLogged, isBlocked, userController.walletHistory)


// / / / / / /  HOTELS  / / / / / / / 
user_route.get("/hotels", hotelManagement.hotels)
user_route.get("/hotel/home", isLogged, isBlocked, hotelManagement.hotelHome)
user_route.post("/hotel/search", hotelManagement.hotelSearch)
user_route.get("/findNearestHotel/:latitude/:longitude", hotelManagement.nearestHotel)
user_route.get("/hotel/filter", hotelManagement.hotelFilter)
user_route.get("/hotel/filter/price", hotelManagement.hotelFilterPrice)


// / / / / / / //Rooms / / / / / / / / / / 
user_route.get("/rooms", roomManagement.rooms)
user_route.get("/hotel/room", isLogged, isBlocked, roomManagement.roomDetails)
user_route.get("/room/filter", roomManagement.roomsFilter)

user_route.get("/room/checkin", isLogged, isBlocked, booking.roomStatus)
user_route.post("/room/book", isLogged, isBlocked, booking.book)

// / / / / / / / CONTACT / / / / / / / / / / //
user_route.get("/contact", isLogged, isBlocked, contact.contact)
user_route.post("/contact", isLogged, isBlocked, contact.submitContact)


// / / / / / / / / PAYMENT / / / / / / / / /
user_route.get("/payment", isLogged, isBlocked, booking.payment)
user_route.post("/payment", isLogged, isBlocked, booking.paymentSuccess)
user_route.get("/applycoupen", isLogged, isBlocked, booking.coupen)

// / / / / / / / BOOKING AND REVIEW AND REPORT / / / / / / / / 
user_route.get("/bookinghistory", isLogged, isBlocked, review.bookingHistory)
user_route.get("/hotel/review", isLogged, isBlocked, review.Hotelreview)
user_route.post("/hotel/review", isLogged, isBlocked, review.submitReview)
user_route.put("/review/edit", isLogged, isBlocked, review.editReview)
user_route.post("/hotel/report", isLogged, isBlocked, review.submitReport)

// / / / / / / / / CANCELLATION / / / / / / / / / / / / /  /
user_route.post("/cancellation", isLogged, isBlocked, cancellation.cancellation)

user_route.post("/authenticate", isLogged)



// / / / / / GOOGLE SIGNIN / / / / / //
var userData


user_route.get('/auth/google/signin', passport.authenticate('google', { scope: ['profile', 'email'] }));
user_route.get('/auth/google/signup', passport.authenticate('google', { scope: ['profile', 'email'] }))

user_route.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {

        const index = userData
        const payload = { index: index };
        const token = jwt.sign(payload, process.env.SECRET_TOKEN, {
            expiresIn: "1h",
        })

        req.session.usertoken = token
        // req.session.user = userData

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
                const refrel = Signup_functions.generateRandomString(10)

                const newUser = new User({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: null,
                    refrelCode: refrel,
                    validation: true,
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