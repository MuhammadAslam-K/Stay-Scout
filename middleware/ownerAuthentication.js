import Owner from "../model/ownerModel.js"


import dotenv from "dotenv"
import jwt from 'jsonwebtoken'

dotenv.config({ path: "config.env" })


const isLogged = (req, res, next) => {
    try {
        if (req.session.ownertoken) {

            const token = req.session.ownertoken
            const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
            req.token = decodedToken
            next()

        } else {
            res.redirect("/owner")

        }
    } catch (error) {
        console.log(error)
    }
}

const islogout = ((req, res, next) => {

    try {
        if (!req.session.ownertoken) {
            next()
        } else {
            res.redirect("/owner/dashboard")
        }
    } catch (error) {
        console.log(error)
    }
})

const isBlocked = (async (req, res, next) => {
    const id = req.token.index._id
    try {
        const user = await Owner.findById(id)
        if (user.is_block) {

            // delete req.session.owner
            delete req.session.ownertoken

            res.redirect("/owner")
        }
        else {
            next()
        }

    } catch (error) {
        res.render("500")
    }
})



export default {
    islogout,
    isLogged,
    isBlocked,
}