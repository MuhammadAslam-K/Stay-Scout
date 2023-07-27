import dotenv from "dotenv"
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'


import Signup_functions from "../../helper/Signup_functions.js"
import User from "../../model/userModel.js"
dotenv.config({ path: "config.env" })




/////////////USER LOGIN/////////

const login = ((req, res) => {
    try {
        res.render("userLogin", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.render("404");
                } else {
                    return res.status(500).render("500");
                }
            }
            res.render("userLogin")
        })
    } catch (error) {
        return res.status(500).render("500");
    }
})

const loginVerify = (async (req, res) => {
    try {

        const { email, password } = req.body
        const userExists = await User.findOne({ email: email })

        if (!email || !password) {
            return res.status(400).json({ error: "Enter the email and password" })
        }

        if (userExists) {

            if (userExists.validation == false) {

                return res.status(401).json({ error: "The user is not valid" })
            }
            else if (userExists.is_block == true) {

                return res.status(400).json({ error: "Your Account is Blocked Please Contact stayscout@gmail.com" })
            }
            else if (!userExists.password) {

                return res.status(400).json({ error: "Please Signin with Google" })
            }

            const passwordMatch = await bcrypt.compare(password, userExists.password)

            if (!passwordMatch) {

                return res.status(400).json({ error: 'incorrect password' })
            }
            else {

                const index = userExists._id
                const payload = { index: index };
                const token = jwt.sign(payload, process.env.SECRET_TOKEN, {
                    expiresIn: "1h",
                })

                req.session.usertoken = token
                req.session.user = userExists

                return res.status(200).end();
            }

        } else {
            return res.status(400).json({ error: 'user not found signup' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error Please try again later" })
    }
})

const logout = ((req, res) => {
    try {
        delete req.session.user
        delete req.session.usertoken
        res.redirect("/login")

    } catch (error) {
        return res.render("profile", { errorMessage: "Internal Server Error Please try again later" });
    }

})


const enterEmail = ((req, res) => {

    try {
        res.render("emailValidation", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.render("404");
                } else {
                    return res.status(500).render("500");
                }
            }
            res.render("emailValidation")
        })
    } catch (error) {
        return res.status(500).render("500");
    }
})

const saveOtp = []
const emailVerfy = (async (req, res) => {
    try {
        req.session.userEmail = req.body.email

        const email = req.session.userEmail
        const emailExits = await User.findOne({ email: email })

        if (!emailExits) {
            return res.status(400).json({ error: "This Email is Not Registered Please Regester Now!!!" })
        }
        if (emailExits.password == null) {

            return res.status(400).json({ error: "This user is registered with google" })
        }
        else if (emailExits) {

            return res.status(200).end()
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error please try again later" })
    }

})


const recoveryotp = ((req, res) => {

    try {
        const email = req.session.userEmail
        const generateOtp = Signup_functions.generateOTP()

        saveOtp.push(generateOtp)
        Signup_functions.sendOTP(email, generateOtp)
        Signup_functions.otpRemoval(saveOtp, generateOtp, 31000)

        res.render("emailValidationOtp", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.status(404).render("404")
                } else {
                    return res.status(500).json({ errorMessage: "Internal Server error please try again later" })
                }
            }
            res.render("emailValidationOtp")
        })
    } catch (error) {
        console.log(error);
        return res.status(500).render("500");
    }
})


const verifyOtp = (async (req, res) => {
    try {
        const enteredOtp = req.body.OTP
        const email = req.session.userEmail

        let i

        for (i = 0; i < saveOtp.length; i++) {

            if (saveOtp[i] == enteredOtp) {
                saveOtp.splice(i, 1)

                const user = await User.findOneAndUpdate(
                    { email: email },
                    { validation: true },
                    { new: true }
                )
                delete req.session.userEmail
                return res.status(200).end()
            }
        }
        return res.status(400).json({ error: "Invalid OTP" })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error please try again later" })
    }
})


export default {
    login,
    loginVerify,
    logout,

    emailVerfy,
    enterEmail,

    recoveryotp,
    verifyOtp,
}
