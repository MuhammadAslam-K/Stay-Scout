import User from "../../model/userModel.js";
import Signup_functions from "../../helper/Signup_functions.js";


// The page for entering email will render
const enterEmail = ((req, res) => {
    try {
        res.render("enterEmail", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.render("404");
                } else {
                    return res.status(500).render("500");
                }
            }
            res.render("enterEmail")
        })
    } catch (error) {
        return res.status(500).render("500");
    }
})

const saveOtp = []

// To validate the email check does the email exist or not
const emailValidation = (async (req, res) => {
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

// Render the page for entering the email
const recoveryotp = ((req, res) => {
    try {
        const email = req.session.userEmail
        const generateOtp = Signup_functions.generateOTP()  // Genarate the otp

        saveOtp.push(generateOtp)
        Signup_functions.sendOTP(email, generateOtp)    // Send OTP to the emal 
        Signup_functions.otpRemoval(saveOtp, generateOtp, 31000)    //To delete the email after 31Sec

        res.render("passwordRecoveryOtp", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.status(404).render("404")
                } else {
                    return res.render("enterEmail").json({ errorMessage: "Internal Server error please try again later" })
                }
            }
            res.render("passwordRecoveryOtp")
        })
    } catch (error) {
        console.log(error);
        return res.status(500).render("500");
    }
})

// verify the entered OTP is valid or not
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
        console.log(error);
        return res.status(500).json({ error: "Internal server error please try again later" })
    }
})

// Render the password page for entering new password
const updatePassword = ((req, res) => {
    try {
        res.render("updatePassword", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.render("404");
                } else {
                    return res.status(500).render("500");
                }
            }
            res.render("updatePassword")
        })
    } catch (error) {
        console.log(error);
        return res.status(500).render("500");
    }
})

// Save the new password
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
        await User.findOneAndUpdate({ email: email }, { password: hashedPassword }, { new: true })

        return res.status(200).end()

    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal server error please try again later" })

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