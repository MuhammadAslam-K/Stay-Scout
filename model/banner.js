import mongoose from "mongoose"

const bannerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    subtitle: {
        type: String,
        required: true
    },
    image: {
        url: {
            type: String,
            required: true
        }
    },
    linkTo: {
        type: String,
        require: true
    },
    available: {
        type: Boolean,
        default: true,
    },
    active: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Owner',
        required: true
    },
    hotel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotels',
        required: true
    }
})

const Banner = mongoose.model('Banner', bannerSchema)
export default Banner