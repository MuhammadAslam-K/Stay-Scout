import User from "../../model/userModel.js";

import dotenv from "dotenv"
import bcrypt from "bcrypt"
import nodemailer from "nodemailer"

dotenv.config({ path: "config.env" })




async function passwordHash(password) {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    } catch (error) {
        console.log(error.message);

    }
}

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
        const email = req.body.email
        req.session.userEmail = email

        const emailExits = await User.findOne({ email: email })

        if (emailExits) {

            const generateOtp = generateOTP()
            saveOtp.push(generateOtp)
            sendOTP(email, generateOtp)

            return res.status(200).end()
        } else {
            return res.status(400).json({ error: "This Email is Not Registered Please Regester Now!!!" })

        }
    } catch (error) {
        console.log(error);
    }

})

const recoveryotp = ((req, res) => {

    try {
        res.render("passwordRecoveryOtp")
    } catch (error) {
        console.log(error);
    }

})

function generateOTP() {
    try {
        let otp = "";
        for (let i = 0; i < 6; i++) {
            otp += Math.floor(Math.random() * 10);
        }
        return otp;
    } catch (error) {
        console.log(error)
    }
}

async function sendOTP(email, otp) {

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS,
            },
        })

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "Your OTP for user verification",
            text: `Your OTP is ${otp}. Please enter this code to verify your Email Account`,
        };
        const result = await transporter.sendMail(mailOptions);
        console.log(result)
    } catch (error) {
        console.log(error.message);
    }
}



const verifyOtp = (async (req, res) => {
    const enteredOtp = req.body.OTP
    try {
        let i
        for (i = 0; i < saveOtp.length; i++) {
            if (saveOtp[i] == enteredOtp) {
                saveOtp.splice(i, 1)

                // res.redirect("/updatePassword")
                return res.status(200).end()
            }
        }
        // res.render("passwordRecoveryOtp", { message: "Invalid userOtp" })
        return res.status(400).json({ error: "Invalid OTP" })
    } catch (error) {
        console.log(104)
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

        } else if (password !== password2) {
            return res.status(400).json({ error: "Password does't match" })
        }

        const hashedPassword = await passwordHash(password)

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