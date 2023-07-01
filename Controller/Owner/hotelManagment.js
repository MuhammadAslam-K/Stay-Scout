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

    } catch (error) {
        console.log(error)

    }
})


export default {
    viewHotels,
    addHotel,
    submitHotel,
}