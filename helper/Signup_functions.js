import bcrypt from "bcrypt"
import nodemailer from "nodemailer"
import dotenv from "dotenv"


dotenv.config({ path: "config.env" })

async function passwordHash(password) {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    } catch (error) {
        console.log(error.message);
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

///////////// VALIDATION /////////////////////
function validate(data, isowner = false) {

    if (isowner) {
        var { name, email, phone, upi, password, password2 } = data;
    } else {
        var { name, email, phone, password, password2 } = data;
    }
    const errors = {}

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\d{12}$/;
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
    }
    else if (!passwordPattern.test(password) || password.length < 8) {
        errors.passwordError = "password must be atleast 8 characters with atleast one uppercase, lowercase, digit and special character";
    }

    // Comfirm Password Validation //
    if (password && !password2) {
        errors.password2Error = "please Enter Your password"
    } else if (password && password2 && password !== password2) {
        errors.password2Error = "passwords doesn't match";
    }

    // UPI Validation //
    if (isowner) {

        if (!upi) {
            errors.upiError = "please Enter your upi Id";
        }
        else if (!upiIdPattern.test(upi)) {
            errors.upiError = "please Enter Valid upi Id";
        }

    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    }
}


function otpRemoval(otpArray, otp) {
    setTimeout(() => {
        const index = otpArray.indexOf(otp);
        if (index !== -1) {
            otpArray.splice(index, 1);
            console.log("OTP removed:", otp);
        }
    }, 31000);
}

export default {
    passwordHash,
    generateOTP,
    sendOTP,
    validate,
    otpRemoval,
}
