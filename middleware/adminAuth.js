


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

const islogout = ((req, res, next) => {

    try {
        if (!req.session.admintoken) {
            next()
        } else {
            res.redirect("/admin/dashboard")
        }
    } catch (error) {
        console.log(error)
    }

})


export default {
    islogout,
    isLogged,
}