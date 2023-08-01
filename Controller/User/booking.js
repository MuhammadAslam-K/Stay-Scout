import adminRevenue from "../../model/adminRevenue.js";
import Owner from "../../model/ownerModel.js";
import User from "../../model/userModel.js"
import Hotel from "../../model/hotelModel.js";
import Room from "../../model/roomsModel.js"
import Booking from "../../model/bokingModel.js";
import Coupen from "../../model/coupon.js"

import propertyValidation from "../../helper/propertyValidation.js";
import availability from "../../helper/checkAvailability.js";
import Signup_function from "../../helper/Signup_functions.js"
import sendHtml from "../../helper/sendHtml.js";
import { ReturnDocument } from "mongodb";



// CHECK DOES THE ROOM IS AVAILABLE//
const book = (async (req, res) => {

    try {
        const id = req.session.room;
        const room = await Room.findById(id)
        const { checkIn, checkOut, adults, kids } = req.body;
        req.session.checkIn = checkIn
        req.session.checkOut = checkOut
        const valid = propertyValidation.bookingValidation(req.body) // To vailidate the form
        const available = await availability.roomisAvailable(id, req.body) // To check does the room is avaialabel or not

        if (!valid.isValid) {
            return res.status(400).json({ error: valid.errors })
        }
        else if (adults > room.adults) {
            return res.status(402).json({ error: `The room cancontain only ${room.adults} Adults` })
        }

        if (kids !== "") {

            if (kids > room.childrents) {
                return res.status(401).json({ error: `The room cancontain only ${room.childrents} kids` })
            }
        }

        if (available === true) {
            return res.status(200).end()
        }
        else if (available === false) {
            return res.status(404).json({ error: "The room is not available for the given date" })
        }

    } catch (error) {
        console.log(error);
        res.render("500")
    }

})

// TO RENDER THE PAYMENT PAGE AND INFORMATION 
const payment = async (req, res) => {

    try {

        const id = req.session.user._id
        const ID = req.session.room;
        const checkIn = new Date(req.session.checkIn)
        const checkOut = new Date(req.session.checkOut)

        const [user, room] = await Promise.all([  // Get the data from the collection
            User.findById(id),
            Room.findById(ID)
        ]);

        const timeDifferenceMs = checkOut - checkIn
        const daysDifference = Math.ceil(timeDifferenceMs / (1000 * 60 * 60 * 24));
        const total = room.price * daysDifference
        let discount = false
        let amountAfterDiscount
        let discountPrice
        if (room.discountPrice != 0) {
            discount = room.discount
            discountPrice = (room.price * room.discount) / 100
            amountAfterDiscount = total - discountPrice
        }

        res.render("payment", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.render("404");
                } else {
                    return res.status(500).render("500");
                }
            }

            res.render("payment", { room, days: daysDifference, total, user, discount, amountAfterDiscount, discountPrice })
        })

    } catch (error) {
        console.log(error);
        res.render("500")
    }
}


// If the payment is success
const paymentSuccess = (async (req, res) => {

    try {
        const coupenCode = req.query.code
        const { radioNoLabel, roomPrice, noOfDays, total } = req.body

        const id = req.session.user._id
        const ID = req.session.room
        const checkIn = new Date(req.session.checkIn)
        const checkOut = new Date(req.session.checkOut)

        const [user, room] = await Promise.all([  // Get the data from the collection
            User.findById(id),
            Room.findById(ID).populate("hotel")
        ]);

        const totalPrice = parseInt(total, 10)
        const newWalletBalance = user.wallet.balance - totalPrice;
        const details = `Booked room in ${room.hotel.name}`
        const date = new Date();
        const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        const adminAmount = (15 / 100) * totalPrice;
        const ownerAmount = (85 / 100) * totalPrice;


        if (radioNoLabel == "walletpayment") { // If the user do payment with wallet

            const user = await User.findByIdAndUpdate(
                { _id: id },
                {
                    $set: { 'wallet.balance': newWalletBalance },
                    $push: {
                        'wallet.transactions': {
                            date: formattedDate,
                            details: details,
                            amount: totalPrice
                        }
                    }
                },
                { new: true }
            );
        }

        const booking = new Booking({
            user: id,
            room: ID,
            hotel: room.hotel._id,
            owner: room.owner,
            checkInDate: checkIn,
            checkOutDate: checkOut,
            paymentMethod: radioNoLabel,
            paymentAmount: total,
            adminAmount,
            ownerAmount,
            totalDays: noOfDays
        })
        await booking.save()

        room.checkIn.push(checkIn)
        room.checkOut.push(checkOut)
        await room.save()


        const hotel = await Hotel.findByIdAndUpdate(  // Update the revenu of hotel
            { _id: room.hotel._id },
            { $inc: { revenue: ownerAmount } },
            { new: true }
        );

        const owner = await Owner.findByIdAndUpdate(    // Update the revenu of owner
            { _id: room.owner },
            { $inc: { revenue: ownerAmount } },
            { new: true }
        )

        const adminrevenue = await adminRevenue.find({ owner: owner._id })

        if (adminrevenue.length != 0) {    // Update the revenu of Admin
            await adminRevenue.findOneAndUpdate(
                { owner: owner._id },
                { $inc: { revenue: adminAmount } },
                { new: true }
            )
        }
        else {
            const newAdminRevenue = new adminRevenue({
                owner: owner._id,
                revenue: adminAmount
            })
            await newAdminRevenue.save()
        }

        if (coupenCode) {
            await Coupen.findOneAndUpdate(
                { couponCode: coupenCode },
                { $push: { usedBy: req.session.user._id } },
                { new: true }
            )
        }

        const emailData = {
            email: req.session.user.email,
            subject: "Booking Confirmation",
            userName: req.session.user.name,
            hotel: hotel.name,
            checkIn,
            checkOut,
            hotelLocation: hotel.address,
            amount: total,
            method: radioNoLabel
        }

        await sendHtml.sendConfirmationMail(emailData)
        return res.status(200).end()
    } catch (error) {
        console.log(error)
        res.render("500")
    }

})



// To show the room status to the user
const roomStatus = async (req, res) => {

    try {
        const id = req.session.room
        const room = await Room.findById(id)

        res.render("calender", {
            checkInDates: JSON.stringify(room.checkIn),
            checkOutDates: JSON.stringify(room.checkOut)
        });

    } catch (error) {
        res.render("500")
    }
}


// Validate the coupen
const coupen = async (req, res) => {

    try {
        const currentDate = new Date()
        const { code, total } = req.query
        const userId = req.session.user._id
        const coupen = await Coupen.findOne({ couponCode: code })
        const amountAfterDiscount = total * (coupen.discount / 100)

        if (!coupen) {
            return res.status(404).json({ error: "This coupen code is not valid" })
        }
        else if (coupen.expireAt < currentDate) {
            return res.status(400).json({ error: "The coupen dtae has been expired" })
        }
        else if (coupen.isBlock) {
            return res.status(400).json({ error: "The Admin has blocked this coupen" })
        }
        else if (userId && coupen.usedBy.includes(userId)) {
            return res.status(400).json({ error: "You already used this coupen" });
        }
        else if (amountAfterDiscount < coupen.minVal) {
            return res.status(400).json({ error: `Minimum amount for this coupen is ${coupen.minVal} but the amount after discvount is ${amountAfterDiscount} so please increase the price` })
        }
        else if (amountAfterDiscount > coupen.maxVal) {
            const amount = total - coupen.maxVal
            return res.status(200).json({ message: `Maximum amount for this coupen is ${coupen.maxVal}`, amount })
        }
        else {
            const amountAfterDiscount = total - (total * (coupen.discount / 100));
            return res.status(200).json({ amount: amountAfterDiscount })
        }

    } catch (error) {
        console.log(error);
        return res.status(400).end()
    }
}

export default {
    book,
    roomStatus,

    payment,
    paymentSuccess,
    coupen,
}
