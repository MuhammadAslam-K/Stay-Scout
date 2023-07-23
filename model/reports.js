import mongoose from "mongoose"

const reportSchema = new mongoose.Schema({
    report: {
        type: String,
        require: true
    },
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})
const Report = mongoose.model("Report", reportSchema);

export default Report