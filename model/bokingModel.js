import mongoose from "mongoose"


const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    hotel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotels',
        required: true
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rooms',
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Owner',
        required: true
    },
    checkInDate: {
        type: Date,
        required: true
    },
    checkOutDate: {
        type: Date,
        required: true
    },
    paymentMethod: {
        type: String
    },
    paymentAmount: {
        type: Number
    },
    totalDays: {
        type: Number
    },
    review: {
        type: Boolean,
        default: false,
    },
    report: {
        type: Boolean,
        default: false,
    },
    cancel: {
        type: Boolean,
        default: false,
    },
    bookedAt: {
        type: Date,
        default: Date.now
    }
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking
