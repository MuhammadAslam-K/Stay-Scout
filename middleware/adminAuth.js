


function isLogged(req, res, next) {

    try {
        if (req.session.admintoken) {
            next()
        } else {
            res.redirect("/admin")
        }
    } catch (error) {
        console.log(error)
    }

}


export default {
    isLogged,
}