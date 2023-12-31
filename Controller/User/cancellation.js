import adminRevenue from "../../model/adminRevenue.js";
import Owner from "../../model/ownerModel.js";
import User from "../../model/userModel.js";
import Hotel from "../../model/hotelModel.js"
import Rooms from "../../model/roomsModel.js";
import Booking from "../../model/bokingModel.js"


// To perform the cancellation
const cancellation = async (req, res) => {
    try {
        const { bookingId, roomCancellation } = req.body;
        const booking = await Booking.findById(bookingId);
        const checkin = new Date(booking.checkInDate);
        const checkout = new Date(booking.checkOutDate);
        const currentDate = new Date();
        const userId = booking.user

        let amountRefund = booking.paymentAmount

        // Check the cancellation policy
        if (roomCancellation === "Free cancellation upto 24hrs before checkin date") {
            const timeDifference = checkin.getTime() - currentDate.getTime();
            const hoursDifference = timeDifference / (1000 * 3600);

            if (hoursDifference >= 24) {
                await userWallet(userId, amountRefund, bookingId)
                return res.status(200).end()
            }
            else {
                cancelBooking(bookingId, booking.room)
                return res.status(401).end()
            }
        }
        else if (roomCancellation === "Non-Refundable") {

            cancelBooking(bookingId, booking.room)
            return res.status(401).end()
        }
        else if (roomCancellation === "Canceling within 7 days before checkin") {

            const timeDifference = checkin.getTime() - currentDate.getTime();
            const daysDifference = timeDifference / (1000 * 3600 * 24);

            if (daysDifference >= 7) {
                await userWallet(userId, amountRefund, bookingId)
                return res.status(200).end()

            }
            else {
                cancelBooking(bookingId, booking.room)
                return res.status(401).end()
            }
        }
        else if (roomCancellation === "Free Cancellation before checkin date") {
            const checkinDate = new Date(booking.checkInDate);
            const currentDate = new Date();

            if (currentDate < checkinDate) {
                await userWallet(userId, amountRefund, bookingId)
                return res.status(200).end()

            }
            else {
                cancelBooking(bookingId, booking.room)
                return res.status(401).end()
            }
        }
        else {
            res.render("500")
        }
    } catch (error) {
        console.error('Error during cancellation:', error);
        res.render("500");
    }
};


//  To perform the money management 
async function userWallet(userId, amout, bookingId) {

    try {
        const date = new Date()
        const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        const adminAmount = (15 / 100) * amout;
        const ownerAmount = (85 / 100) * amout;

        const user = await User.findByIdAndUpdate(  // Add the money to the user wallet
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

        const booking = await Booking.findByIdAndUpdate(    //Update that the user cancelled the booking
            bookingId,
            { cancel: true, refund: true },
            { new: true }
        )

        const room = await Rooms.findById(booking.room);
        const roomIndex = room.availableRooms.findIndex((room) => room.roomNo === booking.roomNo);


        // Find the index of the check-in and check-out dates to remove
        const checkInIndex = room.availableRooms[roomIndex].checkIn.indexOf(booking.checkInDate);
        const checkOutIndex = room.availableRooms[roomIndex].chekout.indexOf(booking.checkOutDate);

        room.availableRooms[roomIndex].checkIn.splice(checkInIndex, 1);
        room.availableRooms[roomIndex].chekout.splice(checkOutIndex, 1);

        await room.save();

        const hotelId = booking.hotel
        const hotel = await Hotel.findByIdAndUpdate(    //Reduce the revenue from the hotel collection
            hotelId,
            { $inc: { revenue: -ownerAmount } },
            { new: true }
        );

        const ownerId = hotel.owner
        await Owner.findByIdAndUpdate(      //Reduce the revenue from the owner collection
            ownerId,
            { $inc: { revenue: -ownerAmount } },
            { new: true }
        )

        await adminRevenue.findOneAndUpdate(    //Reduce the revenue from the admin collection
            { owner: ownerId },
            { $inc: { revenue: -adminAmount } },
            { new: true }
        )

    } catch (error) {
        console.log(error);
    }
}


// If the policy does not meet the conditionn then update the room status and the booking
async function cancelBooking(bookingId, roomId) {
    try {

        const booking = await Booking.findByIdAndUpdate(     //Update that the user cancelled the booking
            bookingId,
            { cancel: true },
            { new: true }
        )


        const room = await Rooms.findById(roomId);
        const roomIndex = room.availableRooms.findIndex((room) => room.roomNo === booking.roomNo);


        // Find the index of the check-in and check-out dates to remove
        const checkInIndex = room.availableRooms[roomIndex].checkIn.indexOf(booking.checkInDate);
        const checkOutIndex = room.availableRooms[roomIndex].chekout.indexOf(booking.checkOutDate);


        // Remove the check-in and check-out dates from the arrays
        room.availableRooms[roomIndex].checkIn.splice(checkInIndex, 1);
        room.availableRooms[roomIndex].chekout.splice(checkOutIndex, 1);

        // Save the updated Room document
        await room.save();
    } catch (error) {
        console.log(error);
    }
}



export default {
    cancellation
}