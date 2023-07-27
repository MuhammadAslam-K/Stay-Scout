import Booking from "../../model/bokingModel.js";
import Hotel from "../../model/hotelModel.js";
import Report from "../../model/reports.js";

import Signup_functions from "../../helper/Signup_functions.js"

// Render the report that is sended by the users
const report = async (req, res) => {
    try {
        const report = await Report.find().populate("user")
        res.render("report", { report })
    }
    catch (error) {
        console.log(error);
        res.render("500")
    }
}

// can delelte the report
const deleteReport = (async (req, res) => {
    try {
        const id = req.query.id
        await Report.findByIdAndDelete(id)
        res.redirect("/admin/report")
    } catch (error) {
        console.log(error);
        res.render("500")
    }
})

// Render and show full details about the report
const reportDetails = async (req, res) => {
    try {
        const id = req.query.id

        const report = await Report.findById(id).populate("user").populate("booking")
        const hotel = await Hotel.findById(report.booking.hotel)

        res.render("reportDetails", { report, hotel })
    } catch (error) {
        console.log(error);
        res.render("500")
    }
}

// Set the report response
const resportStatus = async (req, res) => {
    try {

        const { bookingId, reportId, status } = req.body
        const booking = await Booking.findById(bookingId).populate("user")
        const userEmail = booking.user.email

        await Promise.all([
            Booking.findByIdAndUpdate(
                bookingId,
                { adminResponse: status },
                { new: true }
            ),

            Report.findByIdAndUpdate(
                reportId,
                { adminResponse: status },
                { new: true }
            )
        ])

        let data = `The Admin had ${status} your Report`
        const subject = "Response about your Report"
        Signup_functions.sendOTP(userEmail, data, subject)

        return res.status(200).end()
    } catch (error) {
        console.log(error);
        res.render("500")
    }
}



export default {
    report,
    deleteReport,
    reportDetails,
    resportStatus
}