import Amenities from "../../model/hotelAmenities.js"


// Shows the table for adding the amenities
const amenities = (async (req, res) => {
    try {
        const amenities = await Amenities.find()

        res.render("addAmenities", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.status(404).render("404");
                } else {
                    return res.status(500).render("500");
                }
            }
            res.render("addAmenities", { amenities })
        })

    } catch (error) {
        return res.status(500).render("500");
    }
})

// validate and create new amenities
const addAmenities = (async (req, res) => {
    try {
        const amenitiesName = req.body.amenitiesName
        const existingAmenities = await Amenities.find({ amenities: amenitiesName })

        if (existingAmenities.length != 0) {
            return res.status(400).json({ error: "The Amenities already exists" })
        }
        else {
            const amenitie = new Amenities({ amenities: amenitiesName })
            await amenitie.save()

            return res.status(200).end()
        }
    } catch (error) {
        res.status(500).render("500")
    }
})

// update the amenities
const editAmenities = (async (req, res) => {
    try {
        const id = req.body.id
        const amenities = req.body.updatedName
        const existingAmenities = await Amenities.find({ amenities: amenities })

        if (existingAmenities.length != 0) {
            return res.status(400).json({ error: "The Amenities already exists" })
        }
        else {
            await Amenities.findByIdAndUpdate(id, { amenities: amenities })

            return res.status(200)
        }
    } catch (error) {
        res.status(500).render("500")
    }
})

// Delete the amenities
const deleteAmenities = (async (req, res) => {
    try {
        const id = req.query.id
        await Amenities.findByIdAndDelete(id)
        return res.status(200).end()

    } catch (error) {
        console.log(error);
        return res.status(500).end()
    }
})



export default {
    amenities,
    addAmenities,
    editAmenities,
    deleteAmenities,
}