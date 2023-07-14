import Owner from "../../model/ownerModel.js"
import propertyFetching from "../../helper/propertyFetching.js"
import Hotel from "../../model/hotelModel.js"
import Rooms from "../../model/roomsModel.js"
import Category from "../../model/roomCategory.js"


const ownerHotels = (async (req, res) => {

    try {
        const id = req.query.id
        const hotel = await propertyFetching.hotel(id, 0, 0, false)
        res.render("viewHotel", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.status(404).render("404");
                } else {
                    return res.status(500).render("500");
                }
            }
            res.render("viewHotel", { hotel })
        })
    } catch (error) {
        return res.status(500).render("500");
    }

})

const blockHotel = (async (req, res) => {

    try {
        const id = req.query.id
        const hotel = await Hotel.findById(id)

        hotel.is_block = !hotel.is_block
        await hotel.save()
        res.status(200).end()

    } catch (error) {
        return res.status(500).render("500");
    }

})




export default {
    ownerHotels,
    blockHotel,
}