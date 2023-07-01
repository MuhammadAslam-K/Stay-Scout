import jwt from 'jsonwebtoken'


const tokendecode = (req, res, next) => {

    try {
        const token = req.session.token

        if (!token) {
            res.redirect("/login")
        }

        jwt.verify(token, process.env.SECRET_TOKEN, (err, decoded) => {

            if (err) {
                return res.sendStatus(403)
            }

            req.user = decoded
            next()
        })
    } catch (error) {
        console.log(error)
    }

}

function isLoged(req, res, next) {

    try {
        if (req.session.usertoken) {
            // if (req.session.user) {
            next()
        } else {
            res.redirect("/login")
        }
    } catch (error) {
        console.log(error)
    }

}


export default {
    tokendecode,
    isLoged,
}