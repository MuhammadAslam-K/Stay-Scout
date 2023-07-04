import Owner from "../../model/ownerModel.js";
import bcrypt from "bcrypt"
import nodemailer from "nodemailer"
import dotenv from "dotenv"


dotenv.config({ path: "config.env" })




/////////////// PASSWORD HASHING//////////


async function passwordHash(password) {

    try {

        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash
    } catch (error) {
        console.log(error.message);

    }
}



const signUp = ((req, res) => {

    try {
        res.render("ownerSignup")
    } catch (error) {
        console.log(error);
    }

})

//////////////validation //////////////
function validate(data) {
    const { name, email, phone, password, password2, upi } = data;
    const errors = {}

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\+91\d{10}$/
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[\w\s@$!%*?&#]{8,}$/;
    const upiIdPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;


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

    // UPI id validation //
    if (!upi) {
        errors.upiError = "please Enter your upi Id";
    } else if (!phonePattern.test(phone)) {
        errors.upiError = "please Enter Valid upi Id";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    }
}


//////////// STARTED OTP //////////


let ownerOtp = []

const sendOtp = async (req, res) => {
    try {
        const { name, email, phone, password, password2, upi } = req.body

        const emailExist = await Owner.findOne({ email: email })
        const upiExist = await Owner.findOne({ upi: upi })
        const phoneExist = await Owner.findOne({ phone: phone })

        const valid = validate(req.body)

        if (emailExist) {

            return res.status(409).json({ error: "The owner already Exists please Login" })
        }
        else if (upiExist) {

            return res.status(409).json({ error: "The owner with same upi already Exist please Re-check" })
        }
        else if (phoneExist) {

            return res.status(409).json({ error: "The owner with same Phone Number already Exist please Re-check" })
        }
        else if (!valid.isValid) {

            return res.status(400).json({ error: valid.errors })
        }
        else {
            const generateOtp = generateOTP()
            ownerOtp.push(generateOtp)

            req.session.ownerDetails = {
                name: name,
                email: email,
                phone: phone,
                password: password,
                upi: upi,
            }

            sendOTP(email, generateOtp)
            return res.status(200).end()
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
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "Your OTP for Owner verification",
            text: `Your OTP is ${otp}. Please enter this code to verify your Email Account`,
        };
        const result = await transporter.sendMail(mailOptions);

    } catch (error) {
        console.log(154)
        console.log(error.message);
    }
}


const enterOtp = async (req, res) => {
    try {
        res.render("ownerOtp")
    } catch (error) {
        console.log(error);
    }
}


const verifyOtp = async (req, res) => {
    const enteredOtp = req.body.otp;

    try {
        let i
        let otpMatched = false

        for (i = 0; i < ownerOtp.length; i++) {
            if (ownerOtp[i] == enteredOtp) {
                otpMatched = true

                ownerOtp.splice(i, 1)
                const password = req.session.ownerDetails.password
                const hashedPassword = await passwordHash(password);

                const owner = new Owner({

                    name: req.session.ownerDetails.name,
                    email: req.session.ownerDetails.email,
                    phone: req.session.ownerDetails.phone,
                    upi: req.session.ownerDetails.upi,
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
    }
};

/////////////Ended OTP///////



export default {
    signUp,
    sendOtp,
    enterOtp,
    verifyOtp,
}