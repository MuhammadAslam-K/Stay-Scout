import Signup_functions from "../../helper/Signup_functions.js"
import User from "../../model/userModel.js"



const signUp = ((req, res) => {
    try {
        res.render("userRegister", { user: true })

    } catch (error) {
        console.log(error);
    }
})


//////////// STARTED OTP //////////
let saveOtp = []

const signupValidation = async (req, res) => {

    try {

        const { name, email, phone, password } = req.body
        const emailExist = await User.findOne({ email: email })
        const phoneExist = await User.findOne({ phone: phone })

        const valid = Signup_functions.validate(req.body)

        if (emailExist) {

            return res.status(409).json({ error: "user Exists Please Login" })

        }
        else if (phoneExist) {

            return res.status(409).json({ error: "The user with same Mobile Number already Exist please try another Number" })
        }
        else if (!valid.isValid) {

            return res.status(400).json({ error: valid.errors })
        }
        else {
            console.log(req.body);
            req.session.userDetails = {
                name,
                email,
                phone,
                password
            }
            console.log(req.session.userDetails);
            return res.status(200).end();

        }
    } catch (error) {
        console.log(error);
    }
}


const enterOtp = (req, res) => {
    try {

        console.log(req.session.userDetails)

        const email = req.session.userDetails.email
        const generateOtp = Signup_functions.generateOTP()

        saveOtp.push(generateOtp)
        Signup_functions.sendOTP(email, generateOtp)
        Signup_functions.otpRemoval(saveOtp, generateOtp, 31000)

        res.render("userOtp")

    } catch (error) {
        console.log(error);
    }
}


const verifyOtp = async (req, res) => {
    try {
        const enteredOtp = req.body.otp
        let i

        for (i = 0; i < saveOtp.length; i++) {

            if (saveOtp[i] == enteredOtp) {
                saveOtp.splice(i, 1)

                const { userName, email, phone, password } = req.session.userDetails
                const hashedPassword = await Signup_functions.passwordHash(password)

                const user = new User({
                    name: userName,
                    email,
                    phone,
                    password: hashedPassword,
                })

                delete req.session.userDetails

                try {
                    await user.save()
                    return res.status(200).end();

                } catch (error) {
                    res.send(error)
                }
            }
        }
        return res.status(400).json({ error: "Invalid OTP" })
    } catch (error) {
        console.log(error)
    }
}
/////////////Ended OTP///////


export default {

    signUp,
    signupValidation,
    enterOtp,
    verifyOtp,

};
