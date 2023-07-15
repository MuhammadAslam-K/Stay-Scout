import Signup_functions from "../../helper/Signup_functions.js";
import propertyFetching from "../../helper/propertyFetching.js";
import User from "../../model/userModel.js"


const home = (async (req, res) => {

    // res.render("contact")
    try {
        const banner = await propertyFetching.hotel(null, 0, 2)
        const hotel = await propertyFetching.hotel(null, 0, 2)
        const rooms = await propertyFetching.room(null, 0, 6)

        res.render("home", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.render("404");
                } else {
                    return res.status(500).render("500");
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
                    return res.status(500).render("500");
                }
            }
            res.render("profile", { user })
        })

    } catch (error) {
        return res.status(500).render("500");

    }

})

const profile_edit = async (req, res) => {

    try {
        const { name, email, phone } = req.body;
        const id = req.session.user._id;
        const valid = Signup_functions.profile_edit(req.body)

        if (!valid.isValid) {
            return res.status(400).json({ error: valid.errors })
        }
        else {

            const user = await User.findById(id)

            user.name = name;
            user.email = email;
            user.phone = phone;

            const result = await user.save();
            console.log(result)
            res.status(200).end();
        }
    } catch (error) {
        res.render("500");
    }
}



export default {
    home,
    profile,
    profile_edit,
}