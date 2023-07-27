import Room from "../model/roomsModel.js";

//  To check the room is available or not
const roomisAvailable = async (id, data) => {

    const { checkIn, checkOut, } = data

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    let booking

    booking = await Room.findOne({
        _id: id,
        $or: [
            {
                checkIn: { $lt: checkOutDate },
                checkOut: { $gt: checkInDate }
            },
            {
                checkIn: { $gte: checkInDate, $lte: checkOutDate }
            },
            {
                checkOut: { $gte: checkInDate, $lte: checkOutDate }
            }
        ]
    })

    if (!booking) {
        return true
    }
    else {
        return false
    }
}

export default {
    roomisAvailable,
}