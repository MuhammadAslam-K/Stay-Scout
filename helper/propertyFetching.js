import Hotel from "../model/hotelModel.js";
import Rooms from "../model/roomsModel.js";
import Review from "../model/review.js";


const query = { is_Available: true, is_block: false, adminApproval: "Approved" }
const sort = { booste: -1 }


// To fetch the hotel from the db
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

// To Fetch the room data from the DB
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

// To get the rooms of particulat hotel
const hotelRoom = (async (id) => {
    try {
        const room = await Rooms.find({ hotel: id, ...query }).sort(sort)
        return room
    } catch (error) {
        console.log(error);
    }
})

// To filter and get the room based on the category
const filterRoom = (async (id) => {
    try {

        const categoryId = id
        const rooms = await Rooms.find({ category: categoryId, ...query }).populate('category').populate('hotel')

        return rooms
    } catch (error) {
        console.log(error);
    }

})

// To filter and get the Room based on the category
const filterHotel = (async (id) => {
    try {

        const typeId = id
        const hotels = await Hotel.find({ type: typeId, ...query })

        return hotels
    } catch (error) {
        console.log(error);
    }

})

// For calculating the average rating of the hotel
async function hotelRating(id) {
    try {
        const reviews = await Review.find({ hotel: id });

        if (reviews.length === 0) {
            return null;
        }

        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / reviews.length;
        const roundedRating = Math.round(averageRating);

        return roundedRating

    } catch (error) {
        console.error('Error calculating average rating:', error);
        throw error;
    }
}


// Calculate the distance for finding the nearest hotel
function calculateDistance(lat1, lon1, lat2, lon2) {
    const earthRadiusKm = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadiusKm * c;
    return distance;
}



export default {
    hotel,
    room,
    filterRoom,
    filterHotel,
    hotelRoom,

    hotelRating,
    calculateDistance,
}