import mongoose from "mongoose"

const hotelSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    startingPrice: {
        type: Number,
        require: true
    },
    city: {
        type: String,
        require: true,
    },
    pincode: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    images: [{
        url: {
            type: String,
            required: true
        }
    }],
    typesofroom: {
        type: Number,
        default: 0
    },
    booste: {
        type: Number,
        default: 1
    },
    revenue: {
        type: Number,
        default: 0
    },
    latitude: {
        type: Number,
        required: true,
    },
    longitude: {
        type: Number,
        require: true,
    },
    amenities: {
        type: Array,
    },
    is_Available: {
        type: Boolean,
        default: true
    },
    is_block: {
        type: Boolean,
        default: false
    },
    adminApproval: {
        type: String,
        default: "Pending",
    },
    type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Types',
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Owner',
        required: true
    },
})
const Hotel = mongoose.model("Hotels", hotelSchema)

export default Hotel
