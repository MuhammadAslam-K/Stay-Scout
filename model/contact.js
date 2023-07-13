import mongoose from "mongoose"

const typeSchema = new mongoose.Schema({
    message: {
        type: String,
        require: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
})
const Message = mongoose.model("message", typeSchema);

export default Message