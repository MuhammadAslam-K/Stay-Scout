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
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    }],
    rooms: {
        type: Number,
        default: 0
    },
    users: {
        type: Number,
        default: 0
    },
    revenu: {
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
