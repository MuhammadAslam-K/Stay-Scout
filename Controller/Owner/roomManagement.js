import Rooms from "../../model/roomsModel.js";
import Category from "../../model/roomCategory.js";
import roomAmenities from "../../model/roomAmenities.js"
import propertyValidation from "../../helper/propertyValidation.js"
import cloudinary from "../../config/cloudinary.js"
import Hotel from "../../model/hotelModel.js";
import propertyFetching from "../../helper/propertyFetching.js";
import Cancellation from "../../model/cancellation.js"



const addRoom = (async (req, res) => {
    const category = await Category.find()
    const amenities = await roomAmenities.find()
    const cancellation = await Cancellation.find()
    req.session.hotelId = req.query.id

    try {
        res.render("addRooms", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.status(404).render("404");
                } else {
                    return res.status(500).render("500");
                }
            }
            res.render("addRooms", { category, amenities, cancellation })
        })
    } catch (error) {
        console.log(error);
        return res.status(500).render("500");
    }

})

const submitRoom = (async (req, res) => {
    try {
        const id = req.session.hotelId
        const hotel = await Hotel.findById(id)
        const files = req.files;
        const roomImages = [];
        const valid = propertyValidation.roomValidation(req.body)

        if (!valid.isValid) {
            return res.status(400).json({ error: valid.errors })
        }
        else {
            for (const file of files) {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: "Rooms"
                });

                const image = {
                    url: result.secure_url
                };

                roomImages.push(image);
            }

            const { price, adults, childrents, amenities, Cancellation, bed, category, newCatgory, description } = req.body

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

            const room = new Rooms({
                price,
                adults,
                childrents,
                bed,
                Cancellation,
                description,
                amenities,
                images: roomImages,
                category: categoryId,
                hotel: req.session.hotelId,
                owner: req.session.owner._id,
            })

            hotel.rooms += 1
            console.log(hotel.rooms)
            await hotel.save()
            await room.save()
            return res.send(200).end()
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server error please try again later" })
    }

})


const viewRooms = async (req, res) => {
    const id = req.session.owner._id
    try {
        const rooms = await propertyFetching.room(id, 0, 0, false)
        const category = await Category.find()

        res.render("viewRooms", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.status(404).render("404");
                } else {
                    return res.status(500).render("500");
                }
            }
            res.render("viewRooms", { rooms, category });
        });

    } catch (error) {
        console.log(error);
        return res.status(500).render("500");
    }
};

const blockRoom = (async (req, res) => {

    try {
        const id = req.query.id
        const room = await Rooms.findById(id)

        room.is_Available = !room.is_Available
        await room.save()
        res.status(200).end()

    } catch (error) {
        console.log(error);
        return res.status(500).render("500");
    }

})


const editRoom = (async (req, res) => {

    try {
        const id = req.query.id
        req.session.roomID = id
        const room = await Rooms.findOne({ _id: id });
        const category = await Category.find()
        const amenities = await roomAmenities.find()
        const cancellation = await Cancellation.find()
        res.render("editRoom", { room, category, amenities, cancellation })

    } catch (error) {
        console.log(error)
        res.render("500")
    }
})


const updateRoom = (async (req, res) => {
    try {
        const id = req.session.roomID
        const room = await Rooms.findOne({ _id: id })
        const files = req.files;
        const roomImages = [];
        let amenities = []
        const oldImages = req.body.selectedImages
        const valid = propertyValidation.roomValidation(req.body)

        if (!valid.isValid) {
            return res.status(400).json({ error: valid.errors })
        }
        else {
            for (const file of files) {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: "Rooms"
                });

                const image = {
                    url: result.secure_url
                };

                roomImages.push(image);
            }

            const images = roomImages.concat(oldImages.map((url) => ({ url })));
            const { price, adults, childrents, oldAmenities, newAmenities, Cancellation, bed, category, newCatgory, description } = req.body

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

            if (newAmenities) {
                amenities = [...oldAmenities, newAmenities]
            }
            else {
                amenities = [...oldAmenities]
            }

            room.price = price
            room.adults = adults
            room.childrents = childrents
            room.bed = bed
            room.Cancellation = Cancellation
            room.description = description
            room.amenities = amenities
            room.images = images
            room.category = categoryId

            const resu = await room.save()
            return res.send(200).end()
        }

    } catch (error) {
        console.log(error);
        res.render("500")
    }

})



export default {
    addRoom,
    submitRoom,
    viewRooms,

    blockRoom,
    editRoom,
    updateRoom,
}