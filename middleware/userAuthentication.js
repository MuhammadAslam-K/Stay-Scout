
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


export default {
    islogout,
    isLogged,
}