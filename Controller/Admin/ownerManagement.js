// import Owner from "../../model/OwnerModel.js"
import Owner from "../../model/ownerModel.js"

const viewowner = (async (req, res) => {

    try {
        const ownerDetails = await Owner.find()
        res.render("viewowners", { owner: ownerDetails })
    } catch (error) {
        console.log(error)
    }

})

const searchOwner = (async (req, res) => {

    try {
        const value = req.body.search

        const regexValue = new RegExp(value, "i")

        const users = await Owner.find({
            $or: [
                { name: { $regex: regexValue } },
                { email: { $regex: regexValue } }
            ]
        });

        res.render("viewUser", { users: users })

    } catch (error) {
        console.log(error)
    }

})


const updateowner = (async (req, res) => {

    try {
        const id = req.query.id

        const owner = await Owner.findById(id)
        owner.is_block = !owner.is_block
        await owner.save()

        res.redirect("/admin/owners")
    } catch (error) {
        console.log(error)
    }

})

export default {
    viewowner,
    searchOwner,
    updateowner,
}