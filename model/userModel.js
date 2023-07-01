import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
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
    password: {
        type: String,
        require: true
    },
    is_block: {
        type: Boolean,
        default: false
    },
    prevVisited: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hotels",
        },
    ],
})
const User = mongoose.model("User", userSchema);

export default User