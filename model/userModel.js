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
    // wallet: {
    //     type: Number,
    //     default: 0,
    // },
    // walletHistory: [{
    //     details: String,
    //     amount: Number,
    //     date: new Date(),
    // }],

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
        required: true,
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