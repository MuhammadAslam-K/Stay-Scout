import Hotel from "../../model/hotelModel.js";
import Report from "../../model/reports.js";

const report = async (req, res) => {

    try {
        const report = await Report.find().populate("user")

        res.render("report", { report })

    } catch (error) {
        console.log(error);
        res.render("500")
    }
}

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

export default {
    report,
    deleteReport,
    reportDetails
}