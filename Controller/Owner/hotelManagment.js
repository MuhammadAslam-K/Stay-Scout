import fileUpload from "express-fileupload"
import cloudenary from "../../config/cloudinary.js"
import Hotel from "../../model/hotelModel.js"


const viewHotels = (async (req, res) => {

    try {

        res.render("ownerViewHotels")

    } catch (error) {

        console.log(error)
    }

})

const addHotel = ((req, res) => {

    try {

        res.render("ownerAddHotel")

    } catch (error) {

        console.log(error)
    }

})


const submitHotel = (async (req, res) => {

    try {

        const result = await cloudenary.uploader.upload(req.file.path)
        console.log(result)
        console.log(31)
        console.log(req.session.owner);
        const hotel = new Hotel({
            name: req.body.name,
            description: req.body.description,
            title: req.body.title,
            startingPrice: req.body.startingprice,

            images: [{
                public_id: result.public_id,
                url: result.secure_url
            }],
            // owner: req.session.owner._id,
            // type: req.body.type
        })
        console.log(hotel)
        await hotel.save()
        res.send("okkkkkkkk")

    } catch (error) {
        console.log(49);
        console.log(error)

    }
})


export default {
    viewHotels,
    addHotel,
    submitHotel,
}