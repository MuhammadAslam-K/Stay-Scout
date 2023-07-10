import Rooms from "../../model/roomsModel.js";
import Category from "../../model/category.js";
import propertyValidation from "../../helper/propertyValidation.js"
import cloudinary from "../../config/cloudinary.js"


const addRoom = (async (req, res) => {
    const category = await Category.find()
    console.log(category)
    req.session.hotelId = req.query.id
    // req.session.hotelId = "64a912cc3025e79ba23d0e54"

    try {
        res.render("addRooms", { category })
    } catch (error) {
        console.log(error);
    }

})

const submitRoom = (async (req, res) => {

    try {
        const files = req.files;
        const roomImages = [];
        const valid = propertyValidation.roomValidation(req.body)

        if (!valid.isValid) {

            return res.status(400).json({ error: valid.errors })
        } else {

            for (const file of files) {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: "Rooms"
                });

                const image = {
                    public_id: result.public_id,
                    url: result.secure_url
                };

                roomImages.push(image);
            }

            const { price, adults, childrents, bed, category, newCatgory, description } = req.body

            let categoryId
            if (category == "new" && newCatgory) {
                const newCategoryData = new Category({
                    name: newCatgory
                })
                const savedCategory = await newCategoryData.save()
                categoryId = savedCategory._id
            }
            else {
                categoryId = category
            }
            console.log(60)
            // const hotelId = "64a912cc3025e79ba23d0e54"
            // const ownerId = "64a2cbca876756d2ce1864bb"
            const room = new Rooms({
                price,
                adults,
                childrents,
                bed,
                category: categoryId,
                description,
                images: roomImages,
                hotel: req.session.hotelId,
                // hotel: hotelId,
                owner: req.session.owner._id,

            })
            console.log(room);
            await room.save()
            return res.send(200).end()
        }

    } catch (error) {
        console.log(error);
    }

})

export default {
    addRoom,
    submitRoom
}