import Booking from "../../model/bokingModel.js";
import Review from "../../model/review.js";
import Report from "../../model/reports.js";
import Rooms from "../../model/roomsModel.js";
import Hotel from "../../model/hotelModel.js";


const bookingHistory = async (req, res) => {
    try {
        const userId = req.session.user._id;
        const bookings = await Booking.find({ user: userId }).populate("hotel").populate("room")

        const formattedBookings = bookings.map((booking) => ({
            ...booking.toObject(),
            checkInDate: booking.checkInDate.toISOString().slice(0, 10),
            checkOutDate: booking.checkOutDate.toISOString().slice(0, 10),
        }));

        res.render("bookingHistory", { booking: formattedBookings });
    } catch (error) {
        console.log(error);
        res.render("500");
    }
};

const submitReport = async (req, res) => {
    try {
        const { bookingId, reportText } = req.body
        const userId = req.session.user._id

        const report = new Report({
            report: reportText,
            user: userId,
            booking: bookingId
        })
        await report.save()

        await Booking.findByIdAndUpdate(
            bookingId,
            { report: true },
            { new: true }
        )

        return res.status(200).end()
    } catch (error) {
        console.log(error);
        res.render("500")
    }
}

const Hotelreview = (async (req, res) => {

    try {
        const userId = req.session.user._id
        const hotelId = req.session.hotelID
        const currentDate = new Date();
        const bookings = await Booking.find(
            {
                user: userId,
                hotel: hotelId,
                checkOutDate: { $lte: currentDate },
                cancel: false
            });

        if (bookings.length == 0) {
            return res.status(401).json({ error: "Invalid User" })
        }
        else {
            if (bookings[0].review === false) {
                console.log(71);
                req.session.bookingId = bookings[0]._id;
                return res.status(200).end()
            }
            else {
                console.log(76);
                return res.status(401).json({ error: "You already submitted the review" })
            }
        }

    } catch (error) {
        console.log(error);
        res.render("500")
    }
})


const submitReview = async (req, res) => {

    try {

        const userId = req.session.user._id
        const hotelId = req.session.hotelID
        const bookingId = req.session.bookingId

        const { rating, reviewText } = req.body

        const review = new Review({
            review: reviewText,
            rating: rating,
            hotel: hotelId,
            user: userId
        })

        await review.save()

        await Booking.findByIdAndUpdate(
            bookingId,
            { review: true },
            { new: true }
        )

        return res.status(200).end()
    } catch (error) {
        console.log(error);
        res.render("500")
    }

}




export default {
    bookingHistory,
    submitReport,

    Hotelreview,
    submitReview
}