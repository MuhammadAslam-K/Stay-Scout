import propertyFetching from "../../helper/propertyFetching.js";
import Hotel from "../../model/hotelModel.js";



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
        const hotel = await propertyFetching.hotel(id)
        const rooms = await propertyFetching.hotelRoom(id)

        res.render("hotelHome", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.render("404");
                } else {
                    return res.status(500).render("500");
                }
            }
            res.render("hotelHome", { hotel, rooms })
        })
    } catch (error) {
        return res.status(500).render("500")
    }
})


const hotelSearch = (async (req, res) => {

    try {
        console.log(req.body.search)
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



export default {
    hotels,
    hotelHome,
    hotelSearch,
}