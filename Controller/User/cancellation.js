import Booking from "../../model/bokingModel.js"
import User from "../../model/userModel.js";
import Hotel from "../../model/hotelModel.js"
import Owner from "../../model/ownerModel.js";


const cancellation = async (req, res) => {
    try {
        const { bookingId, roomCancellation } = req.body;
        const booking = await Booking.findById(bookingId);
        const checkin = new Date(booking.checkInDate);
        const checkout = new Date(booking.checkOutDate);
        const currentDate = new Date();
        const userId = booking.user
        let amountRefund = booking.paymentAmount


        if (roomCancellation === "Free cancellation upto 24hrs before checkin date") {
            const timeDifference = checkin.getTime() - currentDate.getTime();
            const hoursDifference = timeDifference / (1000 * 3600);

            if (hoursDifference >= 24) {
                userWallet(userId, amountRefund, bookingId)
                return res.status(200).end()
            }
            else {
                return res.status(401).end()
            }
        }
        else if (roomCancellation === "Non-Refundable") {
            const booking = await Booking.findByIdAndUpdate(
                bookingId,
                { cancel: true },
                { new: true }
            )
            return res.status(401).end()
        }
        else if (roomCancellation === "Canceling within 7 days before checkin") {

            const timeDifference = checkin.getTime() - currentDate.getTime();
            const daysDifference = timeDifference / (1000 * 3600 * 24);

            if (daysDifference <= 7) {
                userWallet(userId, amountRefund, bookingId)
                return res.status(200).end()
            }
            else {
                return res.status(401).end()
            }
        }
        else if (roomCancellation === "Free Cancellation before checkin date") {
            const checkinDate = new Date(booking.checkInDate);
            const currentDate = new Date();

            if (currentDate < checkinDate) {
                userWallet(userId, amountRefund, bookingId)
                return res.status(200).end()
            }
            else {
                return res.status(401).end()
            }
        }
    } catch (error) {
        console.error('Error during cancellation:', error);
        res.render("500");
    }
};


async function userWallet(userId, amout, bookingId) {

    try {
        const date = new Date()
        const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        const user = await User.findByIdAndUpdate(
            userId,
            {
                $inc: { 'wallet.balance': amout },
                $push: {
                    'wallet.transactions': {
                        date: formattedDate,
                        details: "Cancelled the booking",
                        amount: amout
                    }
                }
            },
            { new: true }
        )

        const booking = await Booking.findByIdAndUpdate(
            bookingId,
            { cancel: true },
            { new: true }
        )

        const hotelId = booking.hotel
        const hotel = await Hotel.findByIdAndUpdate(
            hotelId,
            { $inc: { revenue: -amout } },
            { new: true }
        );

        const ownerId = hotel.owner
        await Owner.findByIdAndUpdate(
            ownerId,
            { $inc: { revenue: -amout } },
            { new: true }
        )

    } catch (error) {
        return res.render("500")
    }
}


export default {
    cancellation
}