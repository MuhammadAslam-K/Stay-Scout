import propertyFetching from "../../helper/propertyFetching.js"
import Category from "../../model/roomCategory.js"


// Shows the rooms to the user
const rooms = (async (req, res) => {
    try {
        const [rooms, category] = await Promise.all([
            propertyFetching.room(),
            Category.find(),
        ])

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

// To show the rooms based on the category
const roomsFilter = (async (req, res) => {
    try {
        const [rooms, category] = await Promise.all([
            propertyFetching.filterRoom(req.query.id),
            Category.find(),
        ])

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

// For showing the room details to the user
const roomDetails = (async (req, res) => {
    try {
        const id = req.query.id
        const room = await propertyFetching.room(id)
        req.session.room = id

        let childrents = true

        if (room.childrents == 0) {
            childrents = false
        }

        res.render("viewRoom", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.render("404");
                } else {
                    return res.status(500).render("500");
                }
            }
            res.render("viewRoom", { room, childrents })
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
