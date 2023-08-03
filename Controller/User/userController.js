import Signup_functions from "../../helper/Signup_functions.js";
import propertyFetching from "../../helper/propertyFetching.js";
import User from "../../model/userModel.js"
import Banner from "../../model/banner.js"
import jwt from "jsonwebtoken"


// Home page for the user
const home = (async (req, res) => {
    console.log(10);
    try {
        const [banner, hotel, rooms] = await Promise.all([
            Banner.find({ available: true, active: true }),
            propertyFetching.hotel(null, 0, 2),
            propertyFetching.room(null, 0, 3),
        ])
        console.log(hotel);
        res.render("home", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.render("404");
                } else {
                    return res.status(500).render("500");
                }
            }
            return res.status(200).render("home", { banner, hotel, rooms })
        })
    } catch (error) {
        return res.render("home", { errorMessage: "Internal Server Error Unable to load" });
    }
})

const main = ((req, res) => {
    res.render("userHeader")
})

// To show the profile page to the user
const profile = (async (req, res) => {
    try {
        const id = req.decodedToken.index._id
        const user = await User.findById(id)

        return res.render("profile", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.render("404");
                } else {
                    return res.status(500).render("500");
                }
            }
            // return res.status(200).render("profile", { user })
            res.render("profile", { user })
        })

    } catch (error) {
        console.log(error);
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
    console.log(85);
    try {
        const id = decodedToken.index._id
        console.log(id);
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
    main,
    profile,
    profile_edit,
    walletHistory,
}