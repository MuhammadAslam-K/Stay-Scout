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

const updateowner = (async (req, res) => {

    try {
        const id = req.query.id

        const owner = await Owner.findById(id)
        owner.is_block = !owner.is_block
        await owner.save()

        res.redirect("/superadmin/owners")
    } catch (error) {
        console.log(error)
    }

})

export default {
    viewowner,
    updateowner,
}