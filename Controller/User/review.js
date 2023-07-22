import Booking from "../../model/bokingModel.js";
import Review from "../../model/review.js";
import Report from "../../model/reports.js";
import Rooms from "../../model/roomsModel.js";
import Hotel from "../../model/hotelModel.js";


const bookingHistory = async (req, res) => {
    try {
        const userId = req.session.user._id;
        const bookings = await Booking.find({ user: userId }).populate("hotel");

        // Update the date format to 'YYYY-MM-DD' or convert to Date objects if needed
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
        console.log(req.body);
        const { bookingId, reportText } = req.body
        const userId = req.session.user._id

        const report = new Report({
            report: reportText,
            user: userId,
            booking: bookingId
        })
        await report.save()
        return res.status(200).end()
    } catch (error) {
        console.log(error);
        res.render("500")
    }

}


export default {
    bookingHistory,
    submitReport,
}