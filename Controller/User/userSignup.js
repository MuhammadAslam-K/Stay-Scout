import Signup_functions from "../../helper/Signup_functions.js"
import User from "../../model/userModel.js"



const signUp = ((req, res) => {
    try {

        res.render("userRegister", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.render("404");
                } else {
                    return res.status(500).render("500");
                }
            }
            res.render("userRegister")
        })
    } catch (error) {
        return res.status(500).render("500");
    }
})


//////////// STARTED OTP //////////
let saveOtp = []

const signupValidation = async (req, res) => {

    try {
        // console.log(req.body);
        const { name, email, phone, password, refrelCode } = req.body
        const emailExist = await User.findOne({ email: email })
        const phoneExist = await User.findOne({ phone: phone })
        let refrelCodeExists
        if (refrelCode) {
            refrelCodeExists = await User.findOne({ refrelCode: refrelCode })
        }
        console.log(refrelCodeExists);
        const valid = Signup_functions.validate(true, req.body)
        let wallet = 0
        let walletHistory = []

        console.log(valid);
        if (!valid.isValid) {

            return res.status(400).json({ error: valid.errors })
        }
        else if (phoneExist) {

            return res.status(409).json({ error: "The user with same Mobile Number already Exist please try another Number" })
        }
        else if (emailExist) {
            return res.status(409).json({ error: "user Exists Please Login" })

        }


        if (refrelCodeExists) {
            wallet = 50
            walletHistory.push(refrelCodeExists.name)
        }

        req.session.userDetails = {
            name,
            email,
            phone,
            password,
            wallet,
            walletHistory,
        }

        return res.status(200).end();

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error Please Try agin later" })

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

        res.render("userOtp", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.render("404");
                } else {
                    return res.status(500).render("500");
                }
            }
            res.render("userOtp")
        })

    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error Please Try agin later" })

    }
}


const verifyOtp = async (req, res) => {
    try {

        const enteredOtp = req.body.otp
        console.log(req.session.userDetails.walletHistory);
        console.log(req.session.userDetails.walletHistory[0]);
        const name = req.session.userDetails.walletHistory[0]
        const amount = 100
        const referedUser = await User.findOneAndUpdate({ name: name }, { wallet: amount })

        let i

        for (i = 0; i < saveOtp.length; i++) {

            if (saveOtp[i] == enteredOtp) {
                saveOtp.splice(i, 1)

                const { name, email, phone, password, wallet, walletHistory } = req.session.userDetails
                const refrelCode = Signup_functions.generateRandomString(10);
                console.log(refrelCode);
                const hashedPassword = await Signup_functions.passwordHash(password)

                const user = new User({
                    name,
                    email,
                    phone,
                    password: hashedPassword,
                    refrelCode,
                    wallet,
                    walletHistory,
                })

                delete req.session.userDetails

                try {
                    await user.save()
                    return res.status(200).end();

                } catch (error) {
                    return res.status(500).json({ error: error })
                }
            }
        }
        return res.status(400).json({ error: "Invalid OTP" })
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error Please Try agin later" })
    }
}
/////////////Ended OTP///////


export default {

    signUp,
    signupValidation,
    enterOtp,
    verifyOtp,

};
