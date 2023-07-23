import mongoose from "mongoose"

const revenueSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Owner',
        required: true
    },
    revenue: {
        type: Number,
        require: true,
    }
})
const adminRevenue = mongoose.model("adminRevenue", revenueSchema);

export default adminRevenue