


function isLogged(req, res, next) {

    try {
        if (req.session.ownertoken) {
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


export default {
    islogout,
    isLogged,
}