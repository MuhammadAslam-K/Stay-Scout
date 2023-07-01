import mongoose from "mongoose"

const roomSchema = new mongoose.Schema({
    description: {
        type: String,
        require: true
    },
    title: {
        type: String,
        require: true
    },
    Price: {
        type: Number,
        require: true
    },
    maxPeople: {
        type: Number,
        require: true
    },
    checkIn: {
        type: Date,
        require: true
    },
    checkOut: {
        type: Date,
        require: true
    },
    booste: {
        type: Number,
        default: 1
    },
    is_Available: {
        type: Boolean,
        default: false
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



    // images: [{
    //     public_id: {
    //         type: String,
    //         required: true
    //     },
    //     url: {
    //         type: String,
    //         required: true
    //     }
    // }],