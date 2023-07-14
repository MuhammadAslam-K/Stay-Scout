import Room from "../../model/roomsModel.js"
import propertyValidation from "../../helper/propertyValidation.js";
import availability from "../../helper/checkAvailability.js";

const checkAvailability = async (req, res) => {
    try {
        const id = req.session.room;
        const valid = propertyValidation.bookingValidation(req.body)
        const available = await availability.formValidation(id, req.body)

        if (!valid.isValid) {
            return res.status(400).json({ error: valid.errors })
        }
        else if (available.errors) {
            return res.status(400).json({ error: available.errors })
        }
        else if (available === true) {
            return res.status(200).json({ message: "The Room is Available" })
        }
        else if (available === false) {
            return res.status(404).json({ message: "The room is not available for the given date" })
        }
    } catch (error) {
        res.render("500")
    }
}


const book = (async (req, res) => {

    try {
        const id = req.session.room;
        const room = await Room.findById(id)
        const { checkIn, checkOut } = req.body;
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const valid = propertyValidation.bookingValidation(req.body)
        const available = await availability.formValidation(id, req.body)

        if (!valid.isValid) {
            return res.status(400).json({ error: valid.errors })
        }
        else if (available.errors) {
            return res.status(400).json({ error: available.errors })
        }
        else if (available === true) {
            room.checkIn.push(checkInDate)
            room.checkOut.push(checkOutDate)
            await room.save()

            return res.status(200).json({ message: "The Room is Available" })
        }
        else if (available === false) {
            return res.status(404).json({ message: "The room is not available for the given date" })
        }
    } catch (error) {
        res.render("500")
    }

})


export default {
    checkAvailability,
    book,
}
