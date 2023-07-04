import dotenv from "dotenv"
import twilio from 'twilio'
import bcrypt from "bcrypt"
import nodemailer from "nodemailer"


import User from "../../model/userModel.js"
dotenv.config({ path: "config.env" })




async function passwordHash(password) {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    } catch (error) {
        console.log(error.message);

    }
}

const signUp = ((req, res) => {
    try {
        res.render("userRegister", { user: true })

    } catch (error) {
        console.log(error);
    }
})


//////////////validation //////////////
function validate(data) {
    const { name, email, phone, password, password2 } = data;
    const errors = {}

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\d{12}$/;
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[\w\s@$!%*?&#]{8,}$/;

    // /Name validation //
    if (!name) {
        errors.nameError = "Please Enter Your Name"
    } else if (name.length < 3 || name[0] == " ") {
        errors.nameError = "Enter a Valid Name"
    }

    // email validation //
    if (!email) {
        errors.emailError = "please enter your email address";
    } else if (email.length < 3 || email.trim() === "" || !emailPattern.test(email)) {
        errors.emailError = "please Enter a Valid email";
    }

    // Phone No Validation //
    if (!phone) {
        errors.phoneError = "please Enter your mobile number";
    } else if (!phonePattern.test(phone)) {
        errors.phoneError = "please check your number and provide a valid one";
    }

    // Password Validation //
    if (!password) {
        errors.passwordError = "please Enter Your  password"
    } else if (!passwordPattern.test(password) || password.length < 8) {
        errors.passwordError = "password must be atleast 8 characters with atleast one uppercase, lowercase, digit and special character";
    }

    // Comfirm Password Validation //
    if (password && !password2) {
        errors.password2Error = "please Enter Your password"
    } else if (password && password2 && password !== password2) {
        errors.password2Error = "passwords doesn't match";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    }
}


//////////// STARTED OTP //////////
let saveOtp = []

const sendOtp = async (req, res) => {

    try {

        const { email, phone } = req.body

        const emailExist = await User.findOne({ email: email })
        const phoneExist = await User.findOne({ phone: phone })

        const valid = validate(req.body)

        if (emailExist) {

            return res.status(401).json({ error: "user with same Email already Exists" })

        } else if (phoneExist) {

            return res.status(409).json({ error: "The user with same Mobile Number already Exist please try another Number" })

        } else if (!valid.isValid) {
            return res.status(400).json({ error: valid.errors })
        }
        else {
            const generateOtp = generateOTP()
            saveOtp.push(generateOtp)
            sendOTP(email, generateOtp)


            req.session.userDetails = {
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                password: req.body.password
            }

            return res.status(200).end();

        }
    } catch (error) {
        console.log(error);
    }
}

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
        }
        const result = await transporter.sendMail(mailOptions);

    } catch (error) {
        console.log(error.message);
    }
}

// async function sendOTP(phoneNumber, otp) {
//     const accountSid = process.env.TWILIO_ACCOUNT_SID;
//     const authToken = process.env.TWILIO_AUTH_TOKEN;
//     const client = twilio(accountSid, authToken);

//     try {
//         const message = `Your OTP is: ${otp}.Please enter this code to verify your account`;

//         const sentMessage = await client.messages.create({
//             body: message,
//             from: +15419063467,
//             to: phoneNumber
//         });

//         console.log('OTP sent:', sentMessage.sid);
//     } catch (error) {
//         console.log('Error sending OTP:', error);
//     }
// }


const enterOtp = (req, res) => {

    try {
        res.render("userOtp")
    } catch (error) {
        console.log(error);
    }
}


const verifyOtp = async (req, res) => {
    const enteredOtp = req.body.otp
    console.log(req.body.otp);
    try {
        console.log(enteredOtp, saveOtp)
        let i
        for (i = 0; i < saveOtp.length; i++) {
            if (saveOtp[i] == enteredOtp) {
                saveOtp.splice(i, 1)
                const password = req.session.userDetails.password
                const hashedPassword = await passwordHash(password)

                const user = new User({
                    name: req.session.userDetails.name,
                    email: req.session.userDetails.email,
                    phone: req.session.userDetails.phone,
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
    sendOtp,
    enterOtp,
    verifyOtp,

};
