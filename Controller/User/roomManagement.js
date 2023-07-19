import propertyFetching from "../../helper/propertyFetching.js"
import Category from "../../model/roomCategory.js"


const rooms = (async (req, res) => {
    try {
        const rooms = await propertyFetching.room()
        const category = await Category.find()

        res.render("rooms", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.render("404");
                } else {
                    return res.status(500).render("500");
                }
            }
            res.render("rooms", { rooms, category })
        })
    } catch (error) {
        return res.status(500).render("500");
    }
})

const roomsFilter = (async (req, res) => {
    try {
        const rooms = await propertyFetching.filterRoom(req.query.id)
        const category = await Category.find()

        res.render("rooms", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.render("404");
                } else {
                    return res.status(500).render("500");
                }
            }
            res.render("rooms", { rooms, category })
        })
    } catch (error) {
        return res.status(500).render("500");
    }
})


const roomDetails = (async (req, res) => {
    try {
        const id = req.query.id
        const room = await propertyFetching.room(id)
        req.session.room = id

        res.render("viewRoom", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.render("404");
                } else {
                    console.log(err);
                    return res.status(500).render("500");
                }
            }
            res.render("viewRoom", { room })
        })
    } catch (error) {
        console.log(error);
        return res.status(500).render("500")
    }
})







export default {
    rooms,
    roomDetails,
    roomsFilter,

}
