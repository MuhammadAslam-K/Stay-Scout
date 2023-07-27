import propertyFetching from "../../helper/propertyFetching.js"
import Hotel from "../../model/hotelModel.js"
import adminRevenue from "../../model/adminRevenue.js"


// For viewing the hotels under the owner
const ownerHotels = (async (req, res) => {
    try {
        const id = req.query.id
        req.session.OWNERID = id
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

// Admin can block the hotels
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

// Admin will boost the hotel after the owner pay the amount
const hotelBoosting = async (req, res) => {
    try {
        const id = req.query.id
        const boostValue = req.body.boost

        const updatedHotel = await Hotel.findByIdAndUpdate(
            id,
            { booste: boostValue },
            { new: true }
        );

        return res.json(updatedHotel);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to update boost value' });
    }

}

// Show the page that contain the hotel for approvel
const hotelForApproval = async (req, res) => {
    try {
        const hotels = await Hotel.find({
            adminApproval: { $in: ['Pending', 'Rejected'] }
        }).populate("owner")

        res.render("hotelForApproval", { hotels })
    } catch (error) {
        console.log(error);
        res.render("500")
    }
}


// Response for the approvel of hotel
const hotelForApproval_post = async (req, res) => {

    try {
        const { status, hotelId } = req.body

        const hotel = await Hotel.findByIdAndUpdate(
            hotelId,
            { adminApproval: status },
            { new: true }
        )
        res.status(200).end()
    } catch (error) {
        res.render("500")
    }

}

// For viewing the hotle information
const hotelDetails = (async (req, res) => {
    try {
        const id = req.query.id
        const hotel = await Hotel.findById(id).populate("type")
        res.render("viewHotelDetails", { hotel })

    } catch (error) {
        res.render("500")
    }
})





export default {
    ownerHotels,
    blockHotel,
    hotelBoosting,

    hotelForApproval,
    hotelForApproval_post,
    hotelDetails
}