import propertyFetching from "../../helper/propertyFetching.js";
import User from "../../model/userModel.js"


const home = (async (req, res) => {

    try {
        const banner = await propertyFetching.hotel(null, 0, 2)
        const hotel = await propertyFetching.hotel(null, 0, 2)
        const rooms = await propertyFetching.room(null, 0, 6)

        res.render("home", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.render("404");
                } else {
                    return res.status(500).render("serverError");
                }
            }
            res.render("home", { banner, hotel, rooms })
        })
    } catch (error) {
        return res.render("home", { errorMessage: "Internal Server Error Unable to load" });
    }
})

const profile = (async (req, res) => {
    try {
        const id = req.session.user._id
        const user = await User.findById(id)
        res.render("profile", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.render("404");
                } else {
                    return res.status(500).render("serverError");
                }
            }
            res.render("profile", { user })
        })

    } catch (error) {
        return res.status(500).render("serverError");

    }

})





export default {
    home,
    profile,
}