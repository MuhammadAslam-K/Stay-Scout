import Hotel from "../../model/hotelModel.js"





const dashboard = ((req, res) => {
    try {
        res.render("ownerDashboard")

    } catch (error) {
        console.log(error);
    }
})


const viewHotels = (async (req, res) => {

    const ownerId = req.session.owner._id
    // const ownerId = "64a2cbca876756d2ce1864bb"
    // const ownerId = "64a3ea1093ccd4be58a55243"
    const hotel = await Hotel.find({ owner: ownerId })
    // console.log(hotel)
    try {
        res.render("viewHotels", { hotel: hotel })

    } catch (error) {
        console.log(error)
    }
})


export default {
    viewHotels,
    dashboard,
}