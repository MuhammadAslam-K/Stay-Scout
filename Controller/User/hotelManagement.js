import propertyFetching from "../../helper/propertyFetching.js";
import Hotel from "../../model/hotelModel.js";
import Category from "../../model/roomCategory.js";
import Rooms from "../../model/roomsModel.js";
import hbs from 'handlebars'



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
        console.log(hotel);
        res.render("hotelHome", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.render("404");
                } else {
                    console.log(err);
                    return res.status(500).render("500");
                }
            }
            // res.render("hotelHome", { hotel, rooms })
            res.render("hotelHome", { hotel, rooms, latitude: hotel.latitude, longitude: hotel.longitude });

        })
    } catch (error) {
        console.log(error);
        return res.status(500).render("500")
    }
})


const hotelSearch = (async (req, res) => {
    console.log(60);
    try {
        console.log(req.body.search)
        const value = req.body.search
        console.log(value);
        const regexValue = new RegExp(value, "i")

        const hotel = await Hotel.find({
            $or: [
                { name: { $regex: regexValue } },
                { city: { $regex: regexValue } }
            ]
        })
        console.log(hotel);
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

        const { checkIn, checkOut } = req.body
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const category = await Category.find()

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