import Amenities from "../../model/hotelAmenities.js"



const amenities = (async (req, res) => {
    const amenities = await Amenities.find()
    res.render("addAmenities", { amenities })
})


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

            const amenities = await Amenities.find()
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
        await Amenities.findByIdAndUpdate(id, { amenities: amenities })

        return res.status(200)
    } catch (error) {
        res.status(500).render("500")
    }
})


const deleteAmenities = (async (req, res) => {

    try {
        const id = req.query.id
        console.log(id);
        await Amenities.findByIdAndDelete(id)
        res.redirect("/admin/amenities")

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