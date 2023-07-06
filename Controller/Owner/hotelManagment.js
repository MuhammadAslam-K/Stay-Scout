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

        const files = req.files;
        const hotelImages = [];

        for (const file of files) {
            const result = await cloudenary.uploader.upload(file.path, {
                folder: "Hotels"
            });

            const image = {
                public_id: result.public_id,
                url: result.secure_url
            };

            hotelImages.push(image);
        }

        console.log(31)
        const { name, title, startingPrice, category, description } = req.body
        const hotel = new Hotel({
            name,
            title,
            description,
            startingPrice,
            category,
            images: hotelImages
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