import mongoose from "mongoose"

const roomSchema = new mongoose.Schema({
    description: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    adults: {
        type: Number,
        require: true
    },
    childrents: {
        type: Number,
        require: true
    },
    bed: {
        type: String,
        require: true
    },
    noOfRooms: {
        type: Number,
        require: true,
    },
    amenities: {
        type: String,
        require: true,
    },
    Cancellation: {
        type: String,
        require: true,
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
    checkIn: {
        type: Date,
    },
    checkOut: {
        type: Date,
    },
    booste: {
        type: Number,
        default: 1
    },
    is_Available: {
        type: Boolean,
        default: true
    },
    is_block: {
        type: Boolean,
        default: false
    },
    hotel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotels',
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Owner',
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
})
const Rooms = mongoose.model("Rooms", roomSchema)

export default Rooms



