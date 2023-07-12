import propertyFetching from "../../helper/propertyFetching.js"
import Category from "../../model/category.js"


const rooms = (async (req, res) => {
    try {
        const rooms = await propertyFetching.room()
        const category = await Category.find()

        res.render("rooms", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.render("404");
                } else {
                    return res.status(500).render("serverError");
                }
            }
            res.render("rooms", { rooms, category })
        })
    } catch (error) {
        return res.status(500).render("serverError");
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
                    return res.status(500).render("serverError");
                }
            }
            res.render("rooms", { rooms, category })
        })
    } catch (error) {
        return res.status(500).render("serverError");
    }
})


const roomDetails = (async (req, res) => {
    try {
        const id = req.query.id
        const room = await propertyFetching.room(id)

        res.render("viewRoom", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.render("404");
                } else {
                    return res.status(500).render("serverError");
                }
            }
            res.render("viewRoom", { room })
        })
    } catch (error) {
        return res.status(500).render("serverError")
    }
})


export default {
    rooms,
    roomDetails,
    roomsFilter,
}