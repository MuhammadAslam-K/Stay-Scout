import express from "express"

import authController from "../Controller/User/authController.js"
import userController from "../Controller/User/userController.js"
import auth from "../middleware/userAuthentication.js"
const { tokendecode, isLoged } = auth

const user_route = express.Router()



/////////////USER AUTHENTICATION ROUTES//////////////

user_route.get('/signup', authController.signUp)
user_route.post('/otp', authController.sendOtp)
user_route.get("/otp", authController.enterOtp)
user_route.post("/submitOtp", authController.verifyOtp)

user_route.get("/login", authController.login)
user_route.post("/login", authController.loginVerify)
user_route.get("/logout", authController.logout)

/////////////PASSWORD RECOVERY////////

user_route.get("/passwordRecovery", authController.enterEmail)
user_route.post("/emailValidate", authController.emailValidation)
user_route.post("/verifyotp", authController.passwordOTP)
user_route.get("/updatePassword", authController.updatePassword)
user_route.post("/updatePassword", authController.passwordUpdation)


//////////USER HOME ROUTES/////////

user_route.get("/", userController.home)
user_route.get("/profile", userController.profile)


export default user_route