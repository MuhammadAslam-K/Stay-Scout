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

        const { name, email, phone, password, refrelCode } = req.body
        const emailExist = await User.findOne({ email: email })
        const phoneExist = await User.findOne({ phone: phone })
        const date = new Date();
        const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        const valid = Signup_functions.validate(true, req.body)

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


        if (refrelCode) {

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

        if (referedUser) {
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

        const user = new User({
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


const enterOtp = (req, res) => {
    try {

        const email = req.session.userData.email
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
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error Please Try agin later" })

    }
}


const verifyOtp = async (req, res) => {
    try {

        const enteredOtp = req.body.otp
        const email = req.session.userData.email
        let i

        for (i = 0; i < saveOtp.length; i++) {

            if (saveOtp[i] == enteredOtp) {
                saveOtp.splice(i, 1)
                const user = await User.findOneAndUpdate(
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
/////////////Ended OTP///////


export default {

    signUp,
    signupValidation,
    enterOtp,
    verifyOtp,

};
