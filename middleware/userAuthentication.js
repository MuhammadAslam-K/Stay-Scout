import User from "../model/userModel.js"
import swal from 'sweetalert';



function isLogged(req, res, next) {

    try {
        if (req.session.usertoken) {
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
    const id = req.session.user._id
    try {
        const user = await User.findById(id)
        if (user.is_block) {
            delete req.session.user
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
