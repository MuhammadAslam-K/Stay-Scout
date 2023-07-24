import Owner from "../../model/ownerModel.js"



const viewowner = (async (req, res) => {
    try {
        const ownerDetails = await Owner.find()
        res.render("viewowners", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.status(404).render("404");
                } else {
                    return res.status(500).render("500");
                }
            }
            res.render("viewowners", { owner: ownerDetails })
        })


    } catch (error) {
        return res.status(500).render("500");
    }

})



const blockowner = (async (req, res) => {
    try {
        const id = req.query.id
        const owner = await Owner.findById(id)

        owner.is_block = !owner.is_block
        await owner.save()

        return res.status(200).end()
    } catch (error) {
        return res.status(500).render("500");
    }

})




export default {
    viewowner,
    blockowner,

}