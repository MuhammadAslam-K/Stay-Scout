import mongoose from "mongoose"

const typeSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    }
})
const Type = mongoose.model("Types", typeSchema);

export default Type