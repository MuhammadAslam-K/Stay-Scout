import mongoose from "mongoose"

const typeSchema = new mongoose.Schema({
    amenities: {
        type: String,
        require: true
    }
})
const roomAmenities = mongoose.model("RoomAmenities", typeSchema);

export default roomAmenities