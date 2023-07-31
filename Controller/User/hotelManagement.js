import Hotel from "../../model/hotelModel.js";
import Rooms from "../../model/roomsModel.js";
import Review from "../../model/review.js";
import Category from "../../model/roomCategory.js";
import Type from "../../model/hotelType.js"

import propertyFetching from "../../helper/propertyFetching.js";
import propertyValidation from "../../helper/propertyValidation.js";

// To show all the hotels to the user
const hotels = async (req, res) => {
    try {
        const [hotel, type] = await Promise.all([
            propertyFetching.hotel(),
            Type.find()
        ])

        res.render("userViewHotels", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.render("404");
                } else {
                    return res.status(500).render("500");
                }
            }
            res.render("userViewHotels", { hotel, type })
        });

    } catch (error) {
        console.log(error);
        return res.status(500).render("500");
    }
};


// To show a particular hotel to the user
const hotelHome = (async (req, res) => {
    try {
        const id = req.query.id
        req.session.hotelID = id
        const userId = req.session.user._id

        const [hotel, rooms, ratings, reviews, reviewEdit] = await Promise.all([
            propertyFetching.hotel(id),
            propertyFetching.hotelRoom(id),
            propertyFetching.hotelRating(id),
            Review.find({ hotel: id }).populate("user"),
            Review.findOne({ user: userId, hotel: id }),
        ])

        let reviewExist = false

        if (reviewEdit) {
            reviewExist = true
        }

        res.render("hotelHome", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.render("404");
                } else {
                    return res.status(500).render("500");
                }
            }
            res.render("hotelHome", { hotel, rooms, latitude: hotel.latitude, longitude: hotel.longitude, ratings, reviews, reviewEdit, reviewExist });
        })
    } catch (error) {
        console.log(error);
        return res.status(500).render("500")
    }
})


// The user can search the hotel
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
        console.log(error);
        res.render("500")
    }
})

// To check the rooms are available in the hotel for the particular date
const roomAvailability = (async (req, res) => {
    try {
        const id = req.session.hotelID
        const valid = propertyValidation.hotelHomeForm(req.body)    //.To validate the form
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

// To find the nearest hotel
const nearestHotel = async (req, res) => {
    try {
        const userLat = parseFloat(req.params.latitude);
        const userLong = parseFloat(req.params.longitude);
        let nearestHotel = null;
        let minDistance = Infinity;
        const hotels = await Hotel.find({ is_Available: true, is_block: false, adminApproval: "Approved" });

        hotels.forEach((hotel) => {
            const distance = propertyFetching.calculateDistance(
                userLat,
                userLong,
                hotel.latitude,
                hotel.longitude
            );

            if (distance < minDistance) {
                nearestHotel = hotel;
                minDistance = distance;
            }
        });

        if (nearestHotel) {
            res.render("viewNearestHotel", { hotel: nearestHotel })
        } else {
            res.status(404).json({ message: 'No nearby hotels found.' });
        }

    } catch (error) {
        console.log(error);
        res.render("500")
    }
}

// To filter the hotel based on its type
const hotelFilter = async (req, res) => {
    try {
        console.log(189);
        const [hotel, type] = await Promise.all([
            propertyFetching.filterHotel(req.query.id),
            Type.find(),
        ])

        res.render("userViewHotels", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.render("404");
                } else {
                    return res.status(500).render("500");
                }
            }
            res.render("userViewHotels", { hotel, type })
        })
    } catch (error) {
        return res.status(500).render("500");
    }
}


export default {
    hotels,
    hotelHome,
    hotelSearch,

    roomAvailability,
    nearestHotel,
    hotelFilter,
}