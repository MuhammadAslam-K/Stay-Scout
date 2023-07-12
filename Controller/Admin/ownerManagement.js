import Owner from "../../model/ownerModel.js"
import propertyFetching from "../../helper/propertyFetching.js"
import Hotel from "../../model/hotelModel.js"
import Rooms from "../../model/roomsModel.js"
import Category from "../../model/category.js"


const viewowner = (async (req, res) => {
    try {
        const ownerDetails = await Owner.find()
        res.render("viewowners", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.status(404).render("404");
                } else {
                    return res.status(500).render("serverError");
                }
            }
            res.render("viewowners", { owner: ownerDetails })
        })


    } catch (error) {
        return res.status(500).render("serverError");
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

        res.render("viewUser", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.status(404).render("404");
                } else {
                    return res.status(500).render("serverError");
                }
            }
            res.render("viewUser", { users: users })
        })
    } catch (error) {
        return res.status(500).render("serverError");
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
        return res.status(500).render("serverError");
    }

})

const ownerHotels = (async (req, res) => {

    try {
        const id = req.query.id
        const hotel = await propertyFetching.hotel(id, 0, 0, false)
        res.render("viewHotel", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.status(404).render("404");
                } else {
                    return res.status(500).render("serverError");
                }
            }
            res.render("viewHotel", { hotel })
        })
    } catch (error) {
        return res.status(500).render("serverError");
    }

})

const blockHotel = (async (req, res) => {

    try {
        const id = req.query.id
        const hotel = await Hotel.findById(id)

        hotel.is_block = !hotel.is_block
        await hotel.save()
        res.redirect("/admin/owner/hotels")

    } catch (error) {
        return res.status(500).render("serverError");
    }

})

const searchHotel = (async (req, res) => {
    try {
        console.log(req.body);
        const value = req.body.search
        const regexValue = new RegExp(value, "i")
        console.log(value);
        const hotel = await Hotel.find({
            $or: [
                { name: { $regex: regexValue } }
            ]
        }).populate("type")

        res.render("viewHotel", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.status(404).render("404");
                } else {
                    return res.status(500).render("serverError");
                }
            }
            res.render("viewHotel", { hotel })
        })

    } catch (error) {
        return res.status(500).render("serverError");
    }

})


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
                    return res.status(500).render("serverError");
                }
            }
            res.render("viewRoom", { rooms, category })
        })
    } catch (error) {
        return res.status(500).render("serverError");
    }

})


const RoomFilter = (async (req, res) => {

    try {
        const category = await Category.find()
        const rooms = await propertyFetching.filterRoom(req.query.id)

        res.render("viewRoom", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.status(404).render("404");
                } else {
                    return res.status(500).render("serverError");
                }
            }
            res.render("viewRoom", { rooms, category })
        })
    } catch (error) {
        return res.status(500).render("serverError");
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
                    return res.status(500).render("serverError");
                }
            }
            res.render("viewRoom", { rooms, category })
        })

    } catch (error) {
        return res.status(500).render("serverError");
    }

})



export default {
    viewowner,
    searchOwner,
    updateowner,

    ownerHotels,
    blockHotel,
    searchHotel,

    ownerRooms,
    RoomFilter,
    blockRoom,
}