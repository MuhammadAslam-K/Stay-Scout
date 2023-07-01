


function isLogged(req, res, next) {

    try {
        if (req.session.superadmintoken) {
            next()
        } else {
            res.redirect("/superadmin")
        }
    } catch (error) {
        console.log(error)
    }

}


export default {
    isLogged,
}