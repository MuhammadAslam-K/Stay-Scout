import Hotel from "../../model/hotelModel.js";
import Rooms from "../../model/roomsModel.js";
import Category from "../../model/roomCategory.js";
import roomAmenities from "../../model/roomAmenities.js"
import Cancellation from "../../model/cancellation.js"

import propertyValidation from "../../helper/propertyValidation.js"
import propertyFetching from "../../helper/propertyFetching.js";
import cloudinary from "../../config/cloudinary.js"


// Render the page for adding new room
const addCategory = (async (req, res) => {
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

// validate the room data and store create a new room
const submitCategory = (async (req, res) => {
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

            const { price, adults, childrents, amenities, Cancellation, bed, category, newCatgory, description, noOfRooms } = req.body

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
            let rooms = []
            for (let i = 1; i <= noOfRooms; i++) {
                let room = {
                    roomNo: i
                }
                rooms.push(room)
            }
            console.log(`rooms${rooms}`);

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
                owner: req.token.index._id,
                rooms,
            })

            hotel.rooms += noOfRooms

            await hotel.save()
            const result = await room.save()
            return res.send(200).end()
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server error please try again later" })
    }

})

// View the room to the owners
const viewCategory = async (req, res) => {
    try {
        const id = req.token.index._id
        const [rooms, category] = await Promise.all([
            propertyFetching.room(id, 0, 0, false),
            Category.find()
        ])
        res.render("viewCategory", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.status(404).render("404");
                } else {
                    return res.status(500).render("500");
                }
            }
            res.render("viewCategory", { rooms, category });
        });

    } catch (error) {
        console.log(error);
        return res.status(500).render("500");
    }
};

// owner can make the rooms available or not for the user
const isAvaillable = (async (req, res) => {
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

// Render the page for editing the rooms
const editcategory = (async (req, res) => {
    try {
        const id = req.query.id
        req.session.roomID = id

        const [room, category, amenities, cancellation] = await Promise.all([
            Rooms.findOne({ _id: id }),
            Category.find(),
            roomAmenities.find(),
            Cancellation.find(),
        ])

        res.render("editRoom", { room, category, amenities, cancellation })

    } catch (error) {
        console.log(error)
        res.render("500")
    }
})

// Validate the information and update the rooms information
const updatecategory = (async (req, res) => {
    try {
        const id = req.session.roomID
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

            const room = await Rooms.findByIdAndUpdate(
                id,
                { price, adults, childrents, bed, Cancellation, description, amenities, images, category: categoryId },
                { new: true }
            )


            return res.send(200).end()
        }

    } catch (error) {
        console.log(error);
        res.render("500")
    }

})

const discount = async (req, res) => {
    try {
        const { id, input } = req.params
        const room = await Rooms.findById(id)
        let discountPrice = (room.price * input) / 100
        let priceAfterDiscount = room.price - discountPrice
        await Rooms.findByIdAndUpdate(
            id,
            {
                discount: input,
                discountPrice: priceAfterDiscount
            },
            { new: true }
        )
        return res.status(200).end()
    } catch (error) {
        console.log(error);
        res.render("500")
    }
}


export default {
    addCategory,
    submitCategory,
    viewCategory,
    isAvaillable,
    editcategory,
    updatecategory,
    discount,
}