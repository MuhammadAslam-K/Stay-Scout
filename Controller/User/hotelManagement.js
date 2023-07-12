import propertyFetching from "../../helper/propertyFetching.js";



const hotels = async (req, res) => {

    try {
        const hotel = await propertyFetching.hotel();

        res.render("userViewHotels", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.render("404");
                } else {
                    return res.status(500).render("serverError");
                }
            }
            res.render("userViewHotels", { hotel })
        });

    } catch (error) {
        return res.status(500).render("serverError");
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
                    return res.status(500).render("serverError");
                }
            }
            res.render("hotelHome", { hotel, rooms })
        })
    } catch (error) {
        return res.status(500).render("serverError")
    }
})


export default {
    hotels,
    hotelHome,
}