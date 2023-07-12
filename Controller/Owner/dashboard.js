import propertyFetching from "../../helper/propertyFetching.js";



const dashboard = ((req, res) => {

    try {
        res.render("ownerDashboard", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.status(404).render("404");
                } else {
                    return res.status(500).render("serverError");
                }
            }
            res.render("ownerDashboard")
        })
    } catch (error) {
        return res.status(500).render("serverError");
    }
})


const viewHotels = (async (req, res) => {
    try {
        const ownerId = req.session.owner.id
        // const ownerId = "64a2cbca876756d2ce1864bb"
        // const ownerId = "64a3ea1093ccd4be58a55243"
        const hotel = await propertyFetching.hotel(ownerId, 0, 0, false)

        res.render("viewHotels", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.status(404).render("404");
                } else {
                    return res.status(500).render("serverError");
                }
            }
            res.render("viewHotels", { hotel })
        })
    } catch (error) {
        return res.status(500).render("serverError");
    }
})




export default {
    viewHotels,
    dashboard,
}