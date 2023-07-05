import dotenv from "dotenv"
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'


import User from "../../model/userModel.js"
dotenv.config({ path: "config.env" })




/////////////USER LOGIN/////////

const login = ((req, res) => {
    try {
        res.render("userLogin", { user: true })
    } catch (error) {
        console.log(error);
    }

})

const loginVerify = (async (req, res) => {
    try {

        const { email, password } = req.body
        const userExists = await User.findOne({ email: email })

        if (userExists) {

            if (userExists.is_block == true) {

                return res.status(400).json({ error: "Your Account is Blocked Please Contact stayscout@gmail.com" })
            }
            else if (!userExists.password) {

                return res.status(400).json({ error: "Please Signin with Google" })
            }

            const passwordMatch = await bcrypt.compare(password, userExists.password)

            if (!passwordMatch) {

                return res.status(400).json({ error: 'incorrect password' })
            }
            else {

                const index = userExists._id
                const payload = { index: index };
                const token = jwt.sign(payload, process.env.SECRET_TOKEN, {
                    expiresIn: "1h",
                })

                req.session.usertoken = token
                req.session.user = userExists

                return res.status(200).end();
            }

        } else {
            return res.status(400).json({ error: 'user not found signup' });
        }
    } catch (error) {
        console.log(error);
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
    logout
}
