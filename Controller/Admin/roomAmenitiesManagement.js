import roomAmenities from "../../model/roomAmenities.js"


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


const addAmenities = (async (req, res) => {
    console.log(11);
    try {
        const amenitiesName = req.body.amenitiesName
        const existingAmenities = await roomAmenities.find({ amenities: amenitiesName })

        if (existingAmenities.length != 0) {
            return res.status(400).json({ error: "The Amenities already exists" })
        }
        else {
            const amenitie = new roomAmenities({ amenities: amenitiesName })
            console.log(amenitie)
            await amenitie.save()

            // const amenities = await roomAmenities.find()
            // return res.send(amenities)
            return res.status(200).end()
        }
    } catch (error) {
        res.status(500).render("500")
    }
})

const editAmenities = (async (req, res) => {

    try {

        const id = req.body.id
        const amenities = req.body.updatedName
        await roomAmenities.findByIdAndUpdate(id, { amenities: amenities })

        return res.status(200)
    } catch (error) {
        res.status(500).render("500")
    }
})


const deleteAmenities = (async (req, res) => {

    try {
        const id = req.query.id
        console.log(id);
        await roomAmenities.findByIdAndDelete(id)
        res.redirect("/admin/room/amenities")

    } catch (error) {
        res.render("500")
    }

})




export default {
    amenities,
    addAmenities,
    editAmenities,
    deleteAmenities,
}