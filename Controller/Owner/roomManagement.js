import Rooms from "../../model/roomsModel.js";
import Category from "../../model/roomCategory.js";
import propertyValidation from "../../helper/propertyValidation.js"
import cloudinary from "../../config/cloudinary.js"
import Hotel from "../../model/hotelModel.js";
import propertyFetching from "../../helper/propertyFetching.js";


const addRoom = (async (req, res) => {
    const category = await Category.find()
    // console.log(category)
    req.session.hotelId = req.query.id
    // req.session.hotelId = "64a912cc3025e79ba23d0e54"

    try {
        res.render("addRooms", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.status(404).render("404");
                } else {
                    return res.status(500).render("500");
                }
            }
            res.render("addRooms", { category })
        })
    } catch (error) {
        return res.status(500).render("500");
    }

})

const submitRoom = (async (req, res) => {
    try {
        console.log(24);
        const id = req.session.hotelId
        // const id = "64aba37982494a3e05886cbd"
        const hotel = await Hotel.findById(id)
        console.log(hotel);
        const files = req.files;
        const roomImages = [];
        const h = false
        // const valid = propertyValidation.roomValidation(req.body)

        // if (!valid.isValid) {
        //     console.log(30);
        //     return res.status(400).json({ error: valid.errors })
        // }
        if (h == true) {
            console.log(3);
        }
        else {
            console.log(33);
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

            const { price, adults, childrents, noOfRooms, amenities, Cancellation, bed, category, newCatgory, description } = req.body

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
            // console.log(60)
            // const hotelId = "64aba37982494a3e05886cbd"
            // const ownerId = "64a2cbca876756d2ce1864bb"
            const room = new Rooms({
                price,
                adults,
                childrents,
                bed,
                Cancellation,
                noOfRooms,
                description,
                amenities,
                images: roomImages,
                category: categoryId,
                // hotel: hotelId,
                hotel: req.session.hotelId,
                owner: req.session.owner._id,
                // owner: ownerId,
            })

            hotel.rooms += noOfRooms
            await hotel.save()
            await room.save()
            return res.send(200).end()
        }

    } catch (error) {
        return res.status(500).json({ error: "Internal Server error please try again later" })
    }

})


const viewRooms = async (req, res) => {
    // const id = "64a2cbca876756d2ce1864bb";
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
        return res.status(500).render("500");
    }
};

const blockRoom = (async (req, res) => {

    try {
        const id = req.query.id
        const room = await Rooms.findById(id)

        room.is_Available = !room.is_Available
        await room.save()
        // res.redirect("/owner/rooms")
        res.status(200).end()

    } catch (error) {
        return res.status(500).render("500");
    }

})


const filter = (async (req, res) => {

    try {
        // const categoryId = req.query.id
        // const rooms = await Rooms.find({ category: categoryId }).populate('category').populate('hotel')
        // console.log(rooms);
        const rooms = await propertyFetching.filterRoom(req.query.id)
        const category = await Category.find()
        res.render("viewRooms", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.status(404).render("404");
                } else {
                    return res.status(500).render("500");
                }
            }
            res.render("viewRooms", { rooms, category })
        })
    } catch (error) {
        return res.status(500).render("500");
    }

})

export default {
    addRoom,
    submitRoom,
    viewRooms,

    blockRoom,
    filter,
}