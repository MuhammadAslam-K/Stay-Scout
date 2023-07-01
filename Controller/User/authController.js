import dotenv from "dotenv"
import twilio from 'twilio'
import bcrypt from "bcrypt"
import nodemailer from "nodemailer"
import jwt from 'jsonwebtoken'


import User from "../../model/userModel.js"
dotenv.config({ path: "config.env" })


////////////PASSWOR HASHING////////

async function passwordHash(password) {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    } catch (error) {
        console.log(error.message);

    }
}

/////////////USER LOGIN/////////

const login = ((req, res) => {
    try {
        res.render("login", { user: true })
    } catch (error) {
        console.log(error);
    }

})

const loginVerify = (async (req, res) => {
    try {
        const { email, password } = req.body

        const userExists = await User.findOne({ email: email })

        if (userExists) {
            const passwordMatch = await bcrypt.compare(password, userExists.password)

            if (userExists.is_block == true) {
                res.render("login", { message: "Your Account is Blocked Please Contact stayscout@gmail.com", user: true })
            }

            if (!passwordMatch) {
                res.render("login", { message: "Incorrect Password", user: true })
            }

            if (passwordMatch) {
                const index = userExists._id
                const payload = { index: index };
                const token = jwt.sign(payload, process.env.SECRET_TOKEN, {
                    expiresIn: "1h",
                })

                req.session.usertoken = token
                req.session.user = userExists

                // console.log(req.session.user)
                // console.log(req.session.usertoken)   
                res.redirect("/");
            }

        } else {
            res.render("login", { message: "You dosen't have an Account Please Create one Now!!! ", user: true })
        }
    } catch (error) {
        console.log(error);
    }
})

/////////// USER SignUp /////////

const signUp = ((req, res) => {
    try {
        if (req.session.user) {
            res.redirect("/")
        } else {
            res.render("register")
        }
    } catch (error) {
        console.log(error);
    }
})

//////////// STARTED OTP //////////
let saveOtp = []

const sendOtp = async (req, res) => {
    try {

        const emailExist = await User.findOne({ email: req.body.email })
        const phoneExist = await User.findOne({ phone: req.body.phone })
        if (emailExist) {
            res.render("register", { message: "The user already Exists please Login" })
        } else if (phoneExist) {
            res.render("register", { message: "The user with same Mobile Number already Exist please try another Number" })
        }
        else {
            const generateOtp = generateOTP()
            saveOtp.push(generateOtp)
            req.session.userDetails = {
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                password: req.body.password
            }
            const email = req.session.userDetails.email

            sendOTP(email, generateOtp)
            res.redirect("/otp")
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
    // console.log(109);
    console.log(email);
    console.log(saveOtp)
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS,
            },
        });
        console.log(118);
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "Your OTP for user verification",
            text: `Your OTP is ${otp}. Please enter this code to verify your Email Account`,
        };
        const result = await transporter.sendMail(mailOptions);
        // console.log(result);
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

const enterOtp = async (req, res) => {
    try {
        // res.render("otp")
        res.render("otp")
    } catch (error) {
        console.log(error);
    }
}

const verifyOtp = (async (req, res) => {
    const enteredOtp = req.body.OTP
    try {
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
                    res.redirect("/login")
                } catch (error) {
                    res.send(error)
                }
            }
        }
        res.render("otp", { message: "Invalid OTP" })
    } catch (error) {
        console.log(error)
        console.log(104)
    }
})
/////////////Ended OTP///////


///////////RECOVER PASSWORD/////////

const enterEmail = ((req, res) => {
    try {
        res.render("enterEmail")
    } catch (error) {
        console.log(error);
    }
})

const emailValidation = (async (req, res) => {

    try {
        email = req.body.email
        const emailExits = await User.findOne({ email: email })

        if (emailExits) {

            const generateOtp = generateOTP()
            saveOtp.push(generateOtp)
            sendOTP(email, generateOtp)

            res.render("otp", { passwordRecovery: true })

        } else {
            res.render("enterEmail", { message: "This Email is Not Registered Please Regester Now!!!" })
        }
    } catch (error) {
        console.log(error);
    }

})

const passwordOTP = (async (req, res) => {
    const enteredOtp = req.body.OTP
    try {
        let i
        for (i = 0; i < saveOtp.length; i++) {
            if (saveOtp[i] == enteredOtp) {
                saveOtp.splice(i, 1)

                res.redirect("/updatePassword")
            }
        }
        res.render("otp", { message: "Invalid OTP" })
    } catch (error) {
        console.log(104)
        console.log(error)
    }
})

const updatePassword = ((req, res) => {
    try {
        res.render("updatePassword")
    } catch (error) {
        console.log(error)
    }
})

const passwordUpdation = (async (req, res) => {

    const password = req.body.password

    try {
        console.log(244)
        const hashedPassword = await passwordHash(password)
        console.log(hashedPassword);
        await User.findOneAndUpdate({ email: email }, { password: hashedPassword })
        res.redirect("/login")
    } catch (error) {
        console.log(248)
        console.log(error)
    }
})

const logout = ((req, res) => {

    try {
        delete req.session.user
        delete req.session.usertoken
        res.redirect("/login")
    } catch (error) {
        console.log(error);
    }

})




export default {

    login,
    loginVerify,
    signUp,
    sendOtp,
    enterOtp,
    verifyOtp,
    logout,


    enterEmail,
    emailValidation,
    passwordOTP,
    updatePassword,
    passwordUpdation,
};
