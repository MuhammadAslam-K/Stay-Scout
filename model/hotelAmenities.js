import mongoose from "mongoose"

const typeSchema = new mongoose.Schema({
    amenities: {
        type: String,
        require: true
    }
})
const Amenities = mongoose.model("Amenities", typeSchema);

export default Amenities