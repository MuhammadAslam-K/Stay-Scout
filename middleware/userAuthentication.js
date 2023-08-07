import User from "../model/userModel.js"
import dotenv from "dotenv"
import jwt from 'jsonwebtoken'

dotenv.config({ path: "config.env" })


const isLogged = (req, res, next) => {

    try {
        if (req.session.usertoken) {
            const token = req.session.usertoken
            const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);

            const currentTimestamp = Math.floor(Date.now() / 1000);
            if (decodedToken.exp <= currentTimestamp) {
                res.redirect('/login');
                return
            }

            req.token = decodedToken
            next()
        } else {
            res.redirect("/login")

        }
    } catch (error) {
        console.log(error)
    }
}

const islogout = ((req, res, next) => {

    try {
        if (!req.session.usertoken) {
            next()
        } else {
            res.redirect("/")
        }
    } catch (error) {
        console.log(error)
    }

})



const isBlocked = (async (req, res, next) => {

    const id = req.token.index._id
    try {
        const user = await User.findById(id)
        if (user.is_block) {
            delete req.session.usertoken

            res.redirect("/login")
        }
        else {
            next()
        }

    } catch (error) {
        console.log(error);
    }
})

export default {
    islogout,
    isLogged,
    isBlocked,
}
