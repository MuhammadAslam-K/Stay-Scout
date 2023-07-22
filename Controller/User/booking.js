import Room from "../../model/roomsModel.js"
import Hotel from "../../model/hotelModel.js";
import propertyValidation from "../../helper/propertyValidation.js";
import availability from "../../helper/checkAvailability.js";
import User from "../../model/userModel.js"
import Booking from "../../model/bokingModel.js";




const book = (async (req, res) => {

    try {
        const id = req.session.room;
        const room = await Room.findById(id)
        const { checkIn, checkOut, adults, kids } = req.body;
        req.session.checkIn = checkIn
        req.session.checkOut = checkOut
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
            return res.status(200).end()
        }
        else if (available === false) {
            return res.status(404).json({ error: "The room is not available for the given date" })
        }

    } catch (error) {
        console.log(error);
        res.render("500")
    }

})


const payment = async (req, res) => {

    try {

        const id = req.session.user._id
        const ID = req.session.room;
        const checkIn = new Date(req.session.checkIn)
        const checkOut = new Date(req.session.checkOut)
        const user = await User.findById(id)
        const room = await Room.findById(ID)
        const timeDifferenceMs = checkOut - checkIn
        const daysDifference = Math.ceil(timeDifferenceMs / (1000 * 60 * 60 * 24));
        const total = room.price * daysDifference

        res.render("payment", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.render("404");
                } else {
                    return res.status(500).render("500");
                }
            }

            // res.render("payment", { room, days: daysDifference, total })
            res.render("payment", { room, days: daysDifference, total, user })
        })

    } catch (error) {
        console.log(error);
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



const paymentSuccess = (async (req, res) => {

    try {
        const { radioNoLabel, roomPrice, noOfDays, total } = req.body

        const id = req.session.user._id
        const ID = req.session.room
        const checkIn = new Date(req.session.checkIn)
        const checkOut = new Date(req.session.checkOut)
        const user = await User.findById(id)
        const room = await Room.findById(ID).populate("hotel")
        const totalPrice = parseInt(total, 10)
        const details = `Booked room in ${room.hotel.name}`
        const newWalletBalance = user.wallet.balance - totalPrice;
        const date = new Date();
        const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

        if (radioNoLabel == "walletpayment") {

            const user = await User.findByIdAndUpdate(
                { _id: id },
                {
                    $set: { 'wallet.balance': newWalletBalance },
                    $push: {
                        'wallet.transactions': {
                            date: formattedDate,
                            details: details,
                            amount: totalPrice
                        }
                    }
                },
                { new: true }
            );
        }

        const booking = new Booking({
            user: id,
            room: ID,
            hotel: room.hotel._id,
            checkInDate: checkIn,
            checkOutDate: checkOut,
            paymentMethod: radioNoLabel,
            paymentAmount: total,
            totalDays: noOfDays
        })
        await booking.save()

        room.checkIn.push(checkIn)
        room.checkOut.push(checkOut)
        await room.save()


        await Hotel.findByIdAndUpdate(
            { _id: room.hotel._id },
            { $inc: { revenue: totalPrice } },
            { new: true }
        );

    } catch (error) {
        console.log(error)
        res.render("500")
    }

})




export default {
    book,
    roomcheckin,

    payment,
    paymentSuccess,
}
