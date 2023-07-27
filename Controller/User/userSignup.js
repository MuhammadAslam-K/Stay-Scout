import Signup_functions from "../../helper/Signup_functions.js"
import User from "../../model/userModel.js"


// To render the signup page
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


let saveOtp = []

// For validating and saving the information in the user collection
const signupValidation = async (req, res) => {

    try {

        const { name, email, phone, password, refrelCode } = req.body
        const emailExist = await User.findOne({ email: email })
        const phoneExist = await User.findOne({ phone: phone })
        const date = new Date();
        const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        const valid = Signup_functions.validate(true, req.body)     // Validating the provided informtion are valid or not

        let wallet = 0
        let referedUser
        let transactions = []

        if (!valid.isValid) {
            return res.status(400).json({ error: valid.errors })
        }
        else if (emailExist) {
            return res.status(409).json({ error: "user Exists Please Login" })

        }
        else if (phoneExist) {
            return res.status(409).json({ error: "The user with same Mobile Number already Exist please try another Number" })
        }


        if (refrelCode) {   // If the user have a refrel code find the refred user and add amount to that user wallet

            wallet = 50
            const details = `${name} joined using your Referel`
            referedUser = await User.findOneAndUpdate(
                { refrelCode: refrelCode },
                {
                    $inc: { 'wallet.balance': 100 },
                    $push: {
                        'wallet.transactions': {
                            date: formattedDate,
                            details: details,
                            amount: 100
                        }
                    }
                },
                { new: true }
            );
        }

        if (referedUser) {  // If the refrel code is valid add amount to the user wallet
            const referedUserName = referedUser.name
            let data = {
                date: formattedDate,
                details: `You joined using ${referedUserName} Referel code`,
                amount: wallet
            }
            transactions.push(data)
        }

        const hashedPassword = await Signup_functions.passwordHash(password)
        const userRefrelCode = Signup_functions.generateRandomString(10);

        const user = new User({     // Save new user
            name,
            email,
            phone,
            password: hashedPassword,
            refrelCode: userRefrelCode,
            wallet: {
                balance: wallet,
                transactions: transactions,
            }
        })
        const userData = await user.save()
        req.session.userData = userData
        return res.status(200).end();

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error Please Try agin later" })

    }
}

// The OPT will send and the render the OTP page
const enterOtp = (req, res) => {
    try {

        const email = req.session.userData.email
        const generateOtp = Signup_functions.generateOTP()  // Generate the OTP

        saveOtp.push(generateOtp)
        let data = `Your OTP is ${generateOtp}. Please enter this code to verify your Email Account`
        const subject = "Email for user verification"
        Signup_functions.sendOTP(email, data, subject)    //Send the OTP through mail 
        Signup_functions.otpRemoval(saveOtp, generateOtp, 31000)    // Delete the OTP after the 31 Sec

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
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error Please Try agin later" })

    }
}

// For Validating the OTP 
const verifyOtp = async (req, res) => {
    try {

        const enteredOtp = req.body.otp
        const email = req.session.userData.email
        let i

        for (i = 0; i < saveOtp.length; i++) {

            if (saveOtp[i] == enteredOtp) {
                saveOtp.splice(i, 1)
                const user = await User.findOneAndUpdate(   // Update that the user email is validated
                    { email: email },
                    { validation: true },
                    { new: true }
                )
                delete req.session.userData
                return res.status(200).end()
            }
        }
        return res.status(400).json({ error: "Invalid OTP" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error Please Try agin later" })
    }
}



export default {

    signUp,
    signupValidation,
    enterOtp,
    verifyOtp,

};
