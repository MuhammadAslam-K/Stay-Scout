import Owner from "../model/ownerModel.js"


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

const isBlocked = (async (req, res, next) => {
    const id = req.session.owner._id
    try {
        const user = await Owner.findById(id)
        if (user.is_block) {

            delete req.session.owner
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