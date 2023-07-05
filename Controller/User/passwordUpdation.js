import User from "../../model/userModel.js";
import Signup_functions from "../../helper/Signup_functions.js";



const enterEmail = ((req, res) => {
    try {
        res.render("enterEmail")
    } catch (error) {
        console.log(error);
    }
})

const saveOtp = []
const emailValidation = (async (req, res) => {
    try {
        req.session.userEmail = req.body.email

        const email = req.session.userEmail
        console.log(req.session.userEmail, email)

        const emailExits = await User.findOne({ email: email })

        if (emailExits) {

            return res.status(200).end()

        }
        else {
            return res.status(400).json({ error: "This Email is Not Registered Please Regester Now!!!" })

        }
    } catch (error) {
        console.log(error);
    }

})

const recoveryotp = ((req, res) => {
    try {
        const email = req.session.userEmail
        const generateOtp = Signup_functions.generateOTP()
        saveOtp.push(generateOtp)
        Signup_functions.sendOTP(email, generateOtp)

        Signup_functions.otpRemoval(saveOtp, generateOtp, 31000)
        res.render("passwordRecoveryOtp")

    } catch (error) {
        console.log(error);
    }

})


const verifyOtp = (async (req, res) => {
    try {
        const enteredOtp = req.body.OTP
        let i

        for (i = 0; i < saveOtp.length; i++) {

            if (saveOtp[i] == enteredOtp) {
                saveOtp.splice(i, 1)

                return res.status(200).end()
            }
        }
        return res.status(400).json({ error: "Invalid OTP" })

    } catch (error) {
        console.log(error)
    }
})

const updatePassword = ((req, res) => {
    try {
        res.render("updatePassword")

    } catch (error) {
        console.log(error)
    }
})

const passwordUpdation = (async (req, res) => {

    const { password, password2 } = req.body
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[\w\s@$!%*?&#]{8,}$/;

    try {

        if (!passwordPattern.test(password) || password.length < 8) {

            return res.status(401).json({ error: "password must be atleast 8 characters with atleast one uppercase, lowercase, digit and special character" })
        }
        else if (password !== password2) {

            return res.status(400).json({ error: "Password does't match" })
        }

        const hashedPassword = await Signup_functions.passwordHash(password)
        const email = req.session.userEmail
        await User.findOneAndUpdate({ email: email }, { password: hashedPassword })

        return res.status(200).end()

    } catch (error) {

        console.log(error)
    }
})

export default {
    enterEmail,
    emailValidation,
    recoveryotp,
    verifyOtp,
    updatePassword,
    passwordUpdation
}