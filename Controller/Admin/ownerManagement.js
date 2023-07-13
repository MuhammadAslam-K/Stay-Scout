import Owner from "../../model/ownerModel.js"
import propertyFetching from "../../helper/propertyFetching.js"
import Hotel from "../../model/hotelModel.js"
import Rooms from "../../model/roomsModel.js"
import Category from "../../model/roomCategory.js"


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

        return res.send(users)
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
    searchOwner,
    blockowner,

}