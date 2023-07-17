import Owner from "../../model/ownerModel.js";
import Signup_functions from "../../helper/Signup_functions.js";





const signUp = ((req, res) => {
    try {
        res.render("ownerSignup", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.status(404).render("404");
                } else {
                    return res.status(500).render("500");
                }
            }
            res.render("ownerSignup")
        })
    } catch (error) {
        console.log(error);
        return res.status(500).render("500");
    }
})

//////////// STARTED OTP //////////


let ownerOtp = []

const signupValidate = async (req, res) => {
    try {
        console.log(req.body);
        const { name, email, phone, password } = req.body
        const emailExist = await Owner.findOne({ email: email })
        const phoneExist = await Owner.findOne({ phone: phone })
        const valid = Signup_functions.validate(req.body)

        if (emailExist) {

            return res.status(409).json({ error: "The owner already Exists please Login" })
        }
        else if (phoneExist) {

            return res.status(409).json({ error: "The owner with same Phone Number already Exist please Re-check" })
        }
        else if (!valid.isValid) {

            return res.status(400).json({ error: valid.errors })
        }
        else {

            req.session.ownerDetails = {
                name,
                email,
                phone,
                password,
            }
            console.log(60);
            return res.status(200).end()
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server error please try again later" })
    }
}


const enterOtp = async (req, res) => {
    try {
        console.log(req.session.ownerDetails);
        const email = req.session.ownerDetails.email
        const generateOtp = Signup_functions.generateOTP()

        ownerOtp.push(generateOtp)
        Signup_functions.sendOTP(email, generateOtp)
        Signup_functions.otpRemoval(ownerOtp, generateOtp, 31000)

        res.render("ownerOtp", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.status(404).render("404");
                } else {
                    return res.status(500).render("500");
                }
            }
            res.render("ownerOtp")
        })
    } catch (error) {
        console.log(error);
        return res.status(500).render("500");
    }
}


const verifyOtp = async (req, res) => {
    try {
        const enteredOtp = req.body.otp;
        let i
        let otpMatched = false
        console.log(enteredOtp)
        for (i = 0; i < ownerOtp.length; i++) {

            if (ownerOtp[i] == enteredOtp) {
                otpMatched = true

                ownerOtp.splice(i, 1)

                const { name, email, phone, password, upi } = req.session.ownerDetails
                const hashedPassword = await Signup_functions.passwordHash(password);

                const owner = new Owner({
                    name,
                    email,
                    phone,
                    password: hashedPassword,

                })

                delete req.session.ownerDetails

                try {
                    await owner.save();
                    break

                } catch (error) {
                    console.log(error);
                    return
                }
            }
        }

        if (otpMatched) {
            return res.status(200).end()
        } else {
            return res.status(400).json({ error: "Invalid OTP" })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server error please try again later" })
    }
};





export default {
    signUp,
    signupValidate,
    enterOtp,
    verifyOtp,
}