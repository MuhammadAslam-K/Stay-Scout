import Signup_functions from "../../helper/Signup_functions.js";
import propertyFetching from "../../helper/propertyFetching.js";
import User from "../../model/userModel.js"


// Home page for the user
const home = (async (req, res) => {
    try {
        const [banner, hotel, rooms] = await Promise.all([
            propertyFetching.hotel(null, 0, 2),
            propertyFetching.hotel(null, 2, 2),
            propertyFetching.room(null, 0, 6),
        ])

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

// To show the profile page to the user
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

// For saveing the changes done in profile 
const profile_edit = async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        const id = req.session.user._id;
        const valid = Signup_functions.validate(false, req.body)    // For checking the enterd information are valid or not

        if (!valid.isValid) {
            return res.status(400).json({ error: valid.errors })
        }
        else {

            const user = await User.findByIdAndUpdate(
                id,
                { name, email, phone },
                { new: true }
            )

            res.status(200).end();
        }
    } catch (error) {
        res.render("500");
    }
}

// Render the wallet History
const walletHistory = (async (req, res) => {
    try {
        const id = req.session.user._id
        const user = await User.findById(id)

        res.render("walletHistory", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.render("404");
                } else {
                    return res.status(500).render("500");
                }
            }
            res.render("walletHistory", { user })
        })

    } catch (error) {
        res.render("500")
    }
})




export default {
    home,
    profile,
    profile_edit,
    walletHistory,
}