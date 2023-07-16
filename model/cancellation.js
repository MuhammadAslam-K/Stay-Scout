import mongoose from "mongoose"

const CancellationSchema = new mongoose.Schema({
    cancellation: {
        type: String,
        require: true
    }
})
const Cancellation = mongoose.model("Cancellation", CancellationSchema);

export default Cancellation