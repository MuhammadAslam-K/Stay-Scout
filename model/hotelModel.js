import mongoose from "mongoose"

const hotelSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    title: {
        type: String,
        require: true
    },
    startingPrice: {
        type: Number,
        require: true
    },
    // adddress: {
    //     place: {
    //         type: String,
    //         required: true
    //     },
    //     city: {
    //         type: String,
    //         require: true,
    //     },
    //     pincode: {
    //         type: Number,
    //         required: true
    //     },
    // },
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
    // owner: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Owner',
    //     required: true
    // },
    type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Types',
        required: true
    },
})
const Hotel = mongoose.model("Hotels", hotelSchema)

export default Hotel
