import express from "express"

import loginController from "../Controller/User/userLogin.js"
import signupController from "../Controller/User/userSignup.js"
import passwordUpdation from "../Controller/User/passwordUpdation.js"

import userController from "../Controller/User/userController.js"
import auth from "../middleware/userAuthentication.js"
import googleAuth from "../Controller/User/googleAuth.js"
import passport from "passport"
const { isLogged, islogout } = auth

const user_route = express()
user_route.set("views", "./views/user");



/////////////USER AUTHENTICATION ROUTES//////////////

user_route.get("/login", islogout, loginController.login)
user_route.post("/login", islogout, loginController.loginVerify)
user_route.get("/logout", isLogged, loginController.logout)


user_route.get('/signup', islogout, signupController.signUp)
user_route.post('/otp', islogout, signupController.sendOtp)
user_route.get("/otp", islogout, signupController.enterOtp)
user_route.post("/submitOtp", islogout, signupController.verifyOtp)

/////////////PASSWORD RECOVERY////////

user_route.get("/passwordRecovery", islogout, passwordUpdation.enterEmail)
user_route.post("/emailValidate", islogout, passwordUpdation.emailValidation)
user_route.get("/recovertotp", islogout, passwordUpdation.recoveryotp)
user_route.post("/verifyotp", islogout, passwordUpdation.verifyOtp)
user_route.get("/updatePassword", islogout, passwordUpdation.updatePassword)
user_route.post("/updatePassword", islogout, passwordUpdation.passwordUpdation)


//////////USER HOME ROUTES/////////

user_route.get("/", userController.home)
user_route.get("/profile", isLogged, userController.profile)


/////// GOOGLE SIGNIN///////

user_route.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {

        res.redirect('/');
    }
);


user_route.get('/auth/google', googleAuth.googleSignup)
// user_route.get("/auth/google/callback", googleAuth.googleSuccess)



export default user_route