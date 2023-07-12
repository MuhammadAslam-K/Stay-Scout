import Hotel from "../model/hotelModel.js";
import Rooms from "../model/roomsModel.js";

const query = { is_Available: true, is_block: false }
const sort = { booste: -1 }

const hotel = (async (id = null, skip = 0, limit = 0, user = true) => {

    try {

        if (user == false) {

            if (id) {
                const hotels = Hotel.find({ owner: id }).populate("type")
                return hotels
            }

            const hotels = Hotel.find().populate("type")
            return hotels
        }


        if (id) {
            const hotel = Hotel.findById(id)
            return hotel;
        }

        let hotels = Hotel.find(query).sort(sort).populate("type")
        if (skip !== 0) {
            hotels = hotels.skip(skip)
        }
        else if (limit !== 0) {
            hotels = hotels.limit(limit)
        }

        return hotels
    } catch (error) {
        console.log(error);
    }

})


const room = (async (id = null, skip = 0, limit = 0, user = true) => {
    try {

        if (user == false) {

            if (id) {
                const rooms = Rooms.find({ owner: id })
                    .populate('category')
                    .populate('hotel')
                return rooms
            }

            const rooms = Rooms.find()
            return rooms
        }

        if (id) {
            const rooms = Rooms.findById(id)
            return rooms;
        }

        let rooms = Rooms.find(query).sort(sort).populate('category').populate('hotel')

        if (skip !== 0) {
            rooms = rooms.skip(skip)
        }
        else if (limit !== 0) {
            rooms = rooms.limit(limit)
        }

        return rooms
    } catch (error) {
        console.log(error);
    }

})

const hotelRoom = (async (id) => {

    try {
        const room = await Rooms.find({ hotel: id }).sort(sort)
        // console.log(room);
        return room
    } catch (error) {
        console.log(error);
    }

})

const filterRoom = (async (id) => {

    try {

        const categoryId = id
        const rooms = await Rooms.find({ category: categoryId }).populate('category').populate('hotel')

        return rooms
    } catch (error) {
        console.log(error);
    }

})

export default {
    hotel,
    room,
    filterRoom,
    hotelRoom,
}