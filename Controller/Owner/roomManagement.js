import Hotel from "../../model/hotelModel.js";
import Rooms from "../../model/roomsModel.js";
import Category from "../../model/roomCategory.js";
import roomAmenities from "../../model/roomAmenities.js"
import Cancellation from "../../model/cancellation.js"

import propertyValidation from "../../helper/propertyValidation.js"
import propertyFetching from "../../helper/propertyFetching.js";
import cloudinary from "../../config/cloudinary.js"
import Booking from "../../model/bokingModel.js";


// For showing the room status to the owner
const roomStatus = (async (req, res) => {
    try {
        const id = req.query.id
        const room = await Rooms.findById(id)

        res.render("calender", {
            checkInDates: JSON.stringify(room.checkIn),
            checkOutDates: JSON.stringify(room.checkOut)
        });

    } catch (error) {
        res.render("500")
    }

})



// To display the rooms
const viewRooms = async (req, res) => {
    console.log(281);
    try {
        const roomId = req.query.id
        req.session.ROOMID = roomId
        const rooms = await Rooms.findById(roomId)

        res.render("viewRooms", { rooms })

    } catch (error) {
        console.log(error)
        res.render("500")
    }
}


const isAvaillable = (async (req, res) => {
    try {
        const id = req.session.ROOMID
        const roomNo = req.query.no
        const room = await Rooms.findById(id)
        const roomToUpdate = room.availableRooms.find(room => room.roomNo == roomNo);

        roomToUpdate.is_Available = !roomToUpdate.is_Available;
        await room.save();
        res.status(200).end()

    } catch (error) {
        console.log(error);
        return res.status(500);
    }
})


// For adding the4 room
const addRoom = (async (req, res) => {
    try {
        const { input } = req.params
        const parseInput = parseInt(input)
        const roomId = req.session.ROOMID
        const room = await Rooms.findById(roomId)

        for (let i = 0; i < parseInput; i++) {
            let roomNo = 1
            roomNo += room.availableRooms.length

            let newRoom = {
                roomNo,
            }
            room.availableRooms.push(newRoom)
        }
        room.save()

        return res.status(200).end()
    } catch (error) {
        return res.status(500).end()
    }
})


export default {
    roomStatus,
    viewRooms,
    isAvaillable,
    addRoom,
}