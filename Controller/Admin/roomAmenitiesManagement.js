import roomAmenities from "../../model/roomAmenities.js"

// Render the room amenities table
const amenities = (async (req, res) => {
    try {
        const amenities = await roomAmenities.find()

        res.render("addRoomAmenities", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.status(404).render("404");
                } else {
                    return res.status(500).render("500");
                }
            }
            res.render("addRoomAmenities", { amenities })
        })

    } catch (error) {
        return res.status(500).render("500");
    }
})


// Validate and create new Room Amenities
const addAmenities = (async (req, res) => {
    try {
        const amenitiesName = req.body.amenitiesName
        const existingAmenities = await roomAmenities.find({ amenities: amenitiesName })
        if (amenitiesName == "") {
            return res.status(400).json({ error: "Invalid input" })
        }
        else if (existingAmenities.length != 0) {
            return res.status(400).json({ error: "The Amenities already exists" })
        }
        else {
            const amenitie = new roomAmenities({ amenities: amenitiesName })
            await amenitie.save()

            return res.status(200).end()
        }

    } catch (error) {
        res.status(500).render("500")
    }
})

// update the Room Amenities
const editAmenities = (async (req, res) => {
    try {

        const id = req.body.id
        const amenities = req.body.updatedName
        const existingAmenities = await roomAmenities.find({ amenities: amenities })

        if (existingAmenities.length != 0) {
            return res.status(400).json({ error: "The Amenities already exists" })
        }
        else {
            await roomAmenities.findByIdAndUpdate(id, { amenities: amenities })

            return res.status(200)
        }
    } catch (error) {
        res.status(500).render("500")
    }
})

// Delete the amenitites
const deleteAmenities = (async (req, res) => {
    try {
        const id = req.query.id
        await roomAmenities.findByIdAndDelete(id)
        return res.status(200).end()
    } catch (error) {
        return res.status(500).end()
    }
})




export default {
    amenities,
    addAmenities,
    editAmenities,
    deleteAmenities,
}