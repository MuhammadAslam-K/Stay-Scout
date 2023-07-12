import Owner from "../../model/ownerModel.js"
import propertyFetching from "../../helper/propertyFetching.js"
import Hotel from "../../model/hotelModel.js"
import Rooms from "../../model/roomsModel.js"
import Category from "../../model/category.js"


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

const ownerHotels = (async (req, res) => {

    try {
        const id = req.query.id
        const hotel = await propertyFetching.hotel(id, 0, 0, false)
        res.render("viewHotel", { hotel })
    } catch (error) {
        console.log(error);
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
        console.log(error);
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

        res.render("viewHotel", { hotel })

    } catch (error) {
        console.log(error)
    }

})


const ownerRooms = (async (req, res) => {

    try {
        const id = req.query.id
        req.session.adminHotelId = id
        const category = await Category.find()
        const rooms = await Rooms.find({ hotel: id }).populate("hotel").populate("category")

        res.render("viewRoom", { rooms, category })
    } catch (error) {
        console.log(error);
    }

})


const RoomFilter = (async (req, res) => {

    try {
        const category = await Category.find()
        const rooms = await propertyFetching.filterRoom(req.query.id)

        res.render("viewRoom", { rooms, category })
    } catch (error) {
        console.log(error);
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

        res.render("viewRoom", { rooms, category })

    } catch (error) {
        console.log(error);
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