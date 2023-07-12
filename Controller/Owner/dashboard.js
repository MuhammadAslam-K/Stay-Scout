import propertyFetching from "../../helper/propertyFetching.js";



const dashboard = ((req, res) => {

    res.render("ownerDashboard", (err) => {
        if (err) {
            return res.status(404).render("404")
        }
        res.render("ownerDashboard")
    })
})


const viewHotels = (async (req, res) => {

    const ownerId = req.session.owner.id
    // const ownerId = "64a2cbca876756d2ce1864bb"
    // const ownerId = "64a3ea1093ccd4be58a55243"
    const hotel = await propertyFetching.hotel(ownerId, 0, 0, false)

    res.render("viewHotels", (err) => {
        if (err) {
            return res.status(404).render("404")
        }
        res.render("viewHotels", { hotel })
    })

})




export default {
    viewHotels,
    dashboard,
}