import dotenv from "dotenv"
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'


import Owner from "../../model/ownerModel.js"
dotenv.config({ path: "config.env" })



/////////////owner LOGIN/////////

const login = ((req, res) => {
    try {
        res.render("ownerLogin", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.status(404).render("404");
                } else {
                    return res.status(500).render("500");
                }
            }
            res.render("ownerLogin")
        })
    } catch (error) {
        console.log(error);
        return res.status(500).render("500");
    }
})

const loginVerify = (async (req, res) => {
    try {
        const { email, password } = req.body
        const ownerExistes = await Owner.findOne({ email: email })

        if (ownerExistes) {
            const passwordMatch = await bcrypt.compare(password, ownerExistes.password)

            if (ownerExistes.is_block == true) {

                return res.status(400).json({ error: "Your Account is Blocked Please Contact stayscout@gmail.com" })
            }
            else if (!passwordMatch) {

                return res.status(400).json({ error: "Incorrect Password" })
            }
            else if (passwordMatch) {

                const index = ownerExistes._id
                const payload = { index: index }
                const token = jwt.sign(payload, process.env.SECRET_TOKEN, {
                    expiresIn: "1h",
                })

                req.session.ownertoken = token;
                req.session.owner = ownerExistes
                return res.status(200).end()
            }
        }
        else {
            return res.status(401).json({ error: "You dosen't have an Account Please Create one Now!!!" })
        }

    } catch (error) {
        console.log(error);
        return res.status(401).json({ error: "Internal Server error please try agin later" })
    }
})


const logout = ((req, res) => {
    try {
        delete req.session.owner
        delete req.session.ownertoken
        res.redirect("/owner")

    } catch (error) {
        console.log(error);
        return res.status(500).render("500");
    }
})

/////////// owner SignUp /////////




export default {

    login,
    loginVerify,
    logout,
}