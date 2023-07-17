import propertyFetching from "../../helper/propertyFetching.js";



const dashboard = ((req, res) => {

    try {
        res.render("ownerDashboard", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.status(404).render("404");
                } else {
                    return res.status(500).render("500");
                }
            }
            res.render("ownerDashboard")
        })
    } catch (error) {
        console.log(error);
        return res.status(500).render("500");
    }
})


const viewHotels = (async (req, res) => {
    try {
        const ownerId = req.session.owner.id

        const hotel = await propertyFetching.hotel(ownerId, 0, 0, false)

        res.render("viewHotels", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.status(404).render("404");
                } else {
                    return res.status(500).render("500");
                }
            }
            res.render("viewHotels", { hotel })
        })
    } catch (error) {
        console.log(error);
        return res.status(500).render("500");
    }
})




export default {
    viewHotels,
    dashboard,
}