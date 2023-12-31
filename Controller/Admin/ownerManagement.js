import Booking from "../../model/bokingModel.js";
import Owner from "../../model/ownerModel.js"

// Render the owners table that contain information about the owners 
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

// Admin can block the owners
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

// shows the information of the owner
const ownerDetails = async (req, res) => {
    try {
        const ownerId = req.query.id
        req.session.OwnerID = ownerId
        const details = await Booking.find({ owner: ownerId }).populate("user").populate("hotel").populate("owner")

        res.render("viewOwnerDetails", { details })
    } catch (error) {
        console.log(error);
        res.render("500")
    }

}




export default {
    viewowner,
    blockowner,
    ownerDetails,
}