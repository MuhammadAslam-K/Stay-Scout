import Room from "../../model/roomsModel.js"
import propertyValidation from "../../helper/propertyValidation.js";
import availability from "../../helper/checkAvailability.js";


const book = (async (req, res) => {

    try {
        const id = req.session.room;
        const room = await Room.findById(id)
        const { checkIn, checkOut, adults, kids } = req.body;
        console.log(req.body);
        const valid = propertyValidation.bookingValidation(req.body)
        const available = await availability.formValidation(id, req.body)

        if (!valid.isValid) {

            return res.status(400).json({ error: valid.errors })
        }
        else if (adults > room.adults) {
            return res.status(402).json({ error: `The room cancontain only ${room.adults} Adults` })
        }

        if (kids !== "") {

            if (kids > room.childrents) {
                return res.status(401).json({ error: `The room cancontain only ${room.childrents} kids` })
            }
        }

        if (available === true) {

            const checkInDate = new Date(checkIn);
            const checkOutDate = new Date(checkOut);
            room.checkIn.push(checkInDate)
            room.checkOut.push(checkOutDate)
            await room.save()
            return res.status(200).json({ message: "The Room is Available" })
        }
        else if (available === false) {
            return res.status(404).json({ error: "The room is not available for the given date" })
        }

    } catch (error) {
        res.render("500")
    }

})


const payment = (req, res) => {

    try {
        res.render("payment", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.render("404");
                } else {
                    return res.status(500).render("500");
                }
            }
            res.render("payment")
        })

    } catch (error) {
        res.render("500")
    }

}





const roomcheckin = async (req, res) => {

    try {
        const id = req.session.room
        const room = await Room.findById(id)

        res.render("calender", {
            checkInDates: JSON.stringify(room.checkIn),
            checkOutDates: JSON.stringify(room.checkOut)
        });

    } catch (error) {
        res.render("500")
    }
}


export default {
    book,
    roomcheckin,
    payment,
}
