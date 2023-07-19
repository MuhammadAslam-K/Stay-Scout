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

    },
    password: {
        type: String,

    },
    is_block: {
        type: Boolean,
        default: false
    },
    validation: {
        type: Boolean,
        default: false,
    },
    wallet: {
        balance: {
            type: Number,
            default: 0,
        },
        transactions: [
            {
                date: {
                    type: Date,
                },
                details: {
                    type: String,
                },
                amount: {
                    type: Number,
                },
            },
        ],
    },
    refrelCode: {
        type: String,
        unique: true
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