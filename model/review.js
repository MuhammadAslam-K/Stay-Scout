import mongoose from "mongoose"

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        require: true
    },
    rating: {
        type: Number,
        require: true
    },
    hotel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotel',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})
const Review = mongoose.model("Review", reviewSchema);

export default Review