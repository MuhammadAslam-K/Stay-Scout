import mongoose from "mongoose"



const ownerSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    phone: {
        type: Number,
        require: true
    },
    // upi: {
    //     type: String,
    //     require: true,
    // },
    password: {
        type: String,
        require: true
    },
    is_block: {
        type: Boolean,
        default: false
    },
})
const Owner = mongoose.model("Owner", ownerSchema)

export default Owner