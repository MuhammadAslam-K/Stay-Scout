import Room from "../model/roomsModel.js";



const formValidation = async (id, data) => {
    let errors = {}
    const room = await Room.findById(id)
    const { checkIn, checkOut, adults, kids } = data
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    let booking

    if (kids > room.childrents) {
        console.log(14);
        errors.kidsError = `The Room can contain only ${room.childrents} kids`
    }
    else if (adults > room.adults) {
        console.log(18);
        errors.adultError = `The Room can contain only ${room.adults} Adults`
    }
    if (Object.keys(errors).length === 0) {
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
    else {
        console.log(45);
        return errors
    }

}

export default {
    formValidation,
}