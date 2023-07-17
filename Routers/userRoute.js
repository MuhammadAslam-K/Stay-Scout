import express from "express"

import loginController from "../Controller/User/userLogin.js"
import signupController from "../Controller/User/userSignup.js"
import passwordUpdation from "../Controller/User/passwordUpdation.js"
import hotelManagement from "../Controller/User/hotelManagement.js"
import roomManagement from "../Controller/User/roomManagement.js"
import checkinRooms from "../Controller/User/checkinRooms.js"
import contact from "../Controller/User/contact.js"
import userController from "../Controller/User/userController.js"
import auth from "../middleware/userAuthentication.js"
import googleAuth from "../Controller/User/googleAuth.js"
import passport from "passport"
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


//////// HOTELS /////////////isLogged, isBlocked, 
user_route.get("/hotels", isLogged, isBlocked, hotelManagement.hotels)
user_route.get("/hotel/home", isLogged, isBlocked, hotelManagement.hotelHome)
user_route.post("/hotel/search", isLogged, isBlocked, hotelManagement.hotelSearch)
user_route.post("/hotel/checkin", isLogged, isBlocked, hotelManagement.roomAvailability)

//////////Rooms/////////////
user_route.get("/rooms", isLogged, isBlocked, roomManagement.rooms)
user_route.get("/hotel/room", isLogged, isBlocked, roomManagement.roomDetails)
user_route.get("/room/filter", isLogged, isBlocked, roomManagement.roomsFilter)
user_route.post("/room/checkin", isLogged, isBlocked, checkinRooms.checkAvailability)
user_route.post("/room/book", isLogged, isBlocked, checkinRooms.book)

/////////////CONTACT////////////
user_route.get("/contact", isLogged, isBlocked, contact.contact)
user_route.post("/contact", isLogged, isBlocked, contact.submitContact)


/////// GOOGLE SIGNIN///////

// user_route.get(
//     '/auth/google/callback',
//     passport.authenticate('google', { failureRedirect: '/login' }),
//     (req, res) => {

//         res.redirect('/');
//     }
// );
// user_route.get("/auth/google/callback", googleAuth.googleSuccess)
user_route.get('/auth/google', googleAuth.googleSignup)



export default user_route