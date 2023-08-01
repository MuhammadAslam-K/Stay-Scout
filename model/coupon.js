import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({

    couponCode: {
        type: String,
        require: true
    },
    discount: {
        type: Number,
        require: true,
    },
    minVal: {
        type: Number,
        require: true,
    },
    maxVal: {
        type: Number,
        require: true
    },
    expireAt: {
        type: Date,
        require: true,
    },
    isBlock: {
        type: Boolean,
        default: false,
    },
    usedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }]
})

const Coupon = mongoose.model("Coopen", couponSchema)

export default Coupon