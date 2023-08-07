import Owner from "../../model/ownerModel.js";
import Signup_functions from "../../helper/Signup_functions.js";



// Render the signup page 
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


let ownerOtp = []

// Validate the information
const signupValidate = async (req, res) => {
    try {

        const { name, email, phone, password, bankName, accountNo, ifc } = req.body
        const emailExist = await Owner.findOne({ email: email })
        const phoneExist = await Owner.findOne({ phone: phone })
        const valid = Signup_functions.validate(true, req.body)

        if (emailExist) {
            return res.status(409).json({ error: "The owner already Exists please Login" })
        }
        else if (phoneExist) {
            return res.status(408).json({ error: "The owner with same Phone Number already Exist please Re-check" })
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

            return res.status(200).end()
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server error please try again later" })
    }
}

// Send the otp and render the page for entering the otp
const enterOtp = async (req, res) => {
    try {

        const email = req.session.ownerDetails.email
        const generateOtp = Signup_functions.generateOTP()

        ownerOtp.push(generateOtp)
        let data = `Your OTP is ${generateOtp}. Please enter this code to verify your Email Account`
        const subject = "Email for user verification"

        Signup_functions.sendOTP(email, data, subject)
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

// verify the OTP and create a new owner
const verifyOtp = async (req, res) => {
    try {
        const enteredOtp = req.body.otp;
        let i
        let otpMatched = false
        for (i = 0; i < ownerOtp.length; i++) {

            if (ownerOtp[i] == enteredOtp) {
                otpMatched = true

                ownerOtp.splice(i, 1)

                const { name, email, phone, password, bankName, accountNo, ifc } = req.session.ownerDetails
                const hashedPassword = await Signup_functions.passwordHash(password);

                const owner = new Owner({
                    name,
                    email,
                    phone,
                    password: hashedPassword,
                    bankName,
                    accountNo,
                    ifc,
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