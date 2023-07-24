import propertyFetching from "../../helper/propertyFetching.js";
import propertyValidation from "../../helper/propertyValidation.js";
import Hotel from "../../model/hotelModel.js";
import Category from "../../model/roomCategory.js";
import Rooms from "../../model/roomsModel.js";
import Review from "../../model/review.js"



const hotels = async (req, res) => {

    try {
        const hotel = await propertyFetching.hotel();

        res.render("userViewHotels", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.render("404");
                } else {
                    return res.status(500).render("500");
                }
            }
            res.render("userViewHotels", { hotel })
        });

    } catch (error) {
        return res.status(500).render("500");
    }
};


const hotelHome = (async (req, res) => {

    try {
        const id = req.query.id
        req.session.hotelID = id
        const hotel = await propertyFetching.hotel(id)
        const rooms = await propertyFetching.hotelRoom(id)
        const ratings = await propertyFetching.hotelRating(id)
        const reviews = await Review.find({ hotel: id }).populate("user")


        res.render("hotelHome", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.render("404");
                } else {
                    return res.status(500).render("500");
                }
            }
            res.render("hotelHome", { hotel, rooms, latitude: hotel.latitude, longitude: hotel.longitude, ratings, reviews });
        })
    } catch (error) {
        console.log(error);
        return res.status(500).render("500")
    }
})


const hotelSearch = (async (req, res) => {

    try {
        const value = req.body.search
        const regexValue = new RegExp(value, "i")

        const hotel = await Hotel.find({
            $or: [
                { name: { $regex: regexValue } },
                { city: { $regex: regexValue } }
            ]
        })

        res.render("userViewHotels", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.render("404");
                } else {
                    return res.status(500).render("500");
                }
            }
            res.render("userViewHotels", { hotel })
        });

    } catch (error) {
        res.render("500")
    }
})


const roomAvailability = (async (req, res) => {

    try {
        const id = req.session.hotelID
        const valid = propertyValidation.hotelHomeForm(req.body)
        const { checkIn, checkOut } = req.body
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const category = await Category.find()

        if (!valid.isValid) {
            return res.status(400).json({ error: valid.errors })

        }

        const rooms = await Rooms.find({
            hotel: id,
            $nor: [
                {
                    $and: [
                        { checkIn: { $gte: checkInDate, $lte: checkOutDate } },
                        { checkOut: { $gte: checkInDate, $lte: checkOutDate } }
                    ]
                },
                {
                    $and: [
                        { checkIn: { $lt: checkInDate } },
                        { checkOut: { $gt: checkOutDate } }
                    ]
                }
            ]
        })

        if (rooms.length === 0) {
            return res.status(404).end()
        }
        else {

            return res.status(200).render('rooms', { rooms, category });

        }
    } catch (error) {
        console.log(error);
        res.render("500")
    }
})


export default {
    hotels,
    hotelHome,
    hotelSearch,

    roomAvailability,
}