

function isLoged(req, res, next) {

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


export default {
    isLoged,
}