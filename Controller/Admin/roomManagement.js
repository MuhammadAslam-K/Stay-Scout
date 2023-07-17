import Owner from "../../model/ownerModel.js"
import propertyFetching from "../../helper/propertyFetching.js"
import Hotel from "../../model/hotelModel.js"
import Rooms from "../../model/roomsModel.js"
import Category from "../../model/roomCategory.js"



const ownerRooms = (async (req, res) => {

    try {
        const id = req.query.id
        req.session.adminHotelId = id
        const category = await Category.find()
        const rooms = await Rooms.find({ hotel: id }).populate("hotel").populate("category")

        res.render("viewRoom", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.status(404).render("404");
                } else {
                    return res.status(500).render("500");
                }
            }
            res.render("viewRoom", { rooms, category })
        })
    } catch (error) {
        return res.status(500).render("500");
    }

})



const blockRoom = (async (req, res) => {
    try {

        const id = req.query.id
        const room = await Rooms.findById(id)

        room.is_block = !room.is_block
        await room.save()
        const hotelId = req.session.adminHotelId

        const category = await Category.find()
        const rooms = await Rooms.find({ hotel: hotelId }).populate("hotel").populate("category")

        res.render("viewRoom", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.status(404).render("404");
                } else {
                    return res.status(500).render("500");
                }
            }

            res.send(200).end()
        })

    } catch (error) {
        console.log(error);
        return res.status(500).render("500");
    }

})


const roomBoosting = async (req, res) => {

    const id = req.query.id
    const boostValue = req.body.boost

    try {
        const updatedRoom = await Rooms.findByIdAndUpdate(
            id,
            { booste: boostValue },
            { new: true }
        );

        return res.json(updatedRoom);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to update boost value' });
    }

}




export default {
    ownerRooms,
    blockRoom,
    roomBoosting,
}