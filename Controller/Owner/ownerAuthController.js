import dotenv from "dotenv"
import bcrypt from "bcrypt"
import nodemailer from "nodemailer"
import jwt from 'jsonwebtoken'


import Owner from "../../model/ownerModel.js"
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

/////////////owner LOGIN/////////

const login = ((req, res) => {
    try {
        res.render("login", { owner: true })
    } catch (error) {
        console.log(error);
    }

})

const loginVerify = (async (req, res) => {
    try {
        const { email, password } = req.body

        const ownerExistes = await Owner.findOne({ email: email })

        if (ownerExistes) {
            const passwordMatch = await bcrypt.compare(password, ownerExistes.password)

            if (ownerExistes.is_block == true) {
                res.render("login", { message: "Your Account is Blocked Please Contact stayscout@gmail.com", owner: true })
            }

            if (!passwordMatch) {
                res.render("login", { message: "Incorrect Password", owner: true })
            }

            if (passwordMatch) {
                const index = ownerExistes._id
                const payload = { index: index }

                const token = jwt.sign(payload, process.env.SECRET_TOKEN, {
                    expiresIn: "1h",
                })

                req.session.ownertoken = token;
                req.session.owner = ownerExistes

                res.redirect("/owner/dashboard");
            }

        } else {
            res.render("login", { message: "You dosen't have an Account Please Create one Now!!! ", owner: true })
        }
    } catch (error) {
        console.log(error);
    }
})


/////////// owner SignUp /////////

const signUp = ((req, res) => {
    try {
        if (req.session.ownertoken) {
            res.redirect("/owner/dashboard")
        } else {
            res.render("register", { owner: true })
        }
    } catch (error) {
        console.log(error);
    }
})

//////////// STARTED OTP //////////
let ownerOtp = []

const sendOtp = async (req, res) => {
    try {
        const emailExist = await Owner.findOne({ email: req.body.email })
        const upiExist = await Owner.findOne({ upi: req.body.upi })

        if (emailExist) {
            res.render("register", { message: "The owner already Exists please Login", owner: true })
        } else if (upiExist) {
            res.render("register", { message: "The owner with same upi already Exist please Re-check", owner: true })
        }
        else {
            const generateOtp = generateOTP()
            ownerOtp.push(generateOtp)

            req.session.ownerDetails = {
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                password: req.body.password,
                upi: req.body.upi,
            }
            const email = req.session.ownerDetails.email

            sendOTP(email, generateOtp)
            res.render("otp", { owner: true })
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
        console.log(144);
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "Your OTP for Owner verification",
            text: `Your OTP is ${otp}. Please enter this code to verify your Email Account`,
        };
        const result = await transporter.sendMail(mailOptions);
        console.log(result)
    } catch (error) {
        console.log(154)
        console.log(error.message);
    }
}


const enterOtp = async (req, res) => {
    try {

        res.render("otp", { owner: true })
    } catch (error) {
        console.log(error);
    }
}


const verifyOtp = async (req, res) => {
    const enteredOtp = req.body.OTP;
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
            res.redirect("/owner")
        } else {
            res.render("otp", { message: "Invalid OTP", owner: true })
        }
    } catch (error) {
        console.log(error);
    }
};

/////////////Ended OTP///////

const logout = ((req, res) => {
    try {
        delete req.session.owner
        delete req.session.ownertoken
        res.redirect("/owner")
    } catch (error) {
        console.log(error);
    }
})

const dashboard = ((req, res) => {
    try {
        res.render("ownerDashboard")
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
    dashboard,
}