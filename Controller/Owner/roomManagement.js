import Hotel from "../../model/hotelModel.js";
import Rooms from "../../model/roomsModel.js";
import Category from "../../model/roomCategory.js";
import roomAmenities from "../../model/roomAmenities.js"
import Cancellation from "../../model/cancellation.js"

import propertyValidation from "../../helper/propertyValidation.js"
import propertyFetching from "../../helper/propertyFetching.js";
import cloudinary from "../../config/cloudinary.js"


// Render the page for adding new room
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

// validate the room data and store create a new room
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

            await hotel.save()
            await room.save()
            return res.send(200).end()
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server error please try again later" })
    }

})

// View the room to the owners
const viewRooms = async (req, res) => {
    const id = req.session.owner._id
    try {
        const [rooms, category] = await Promise.all([
            propertyFetching.room(id, 0, 0, false),
            Category.find()
        ])

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
const editRoom = (async (req, res) => {
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
const updateRoom = (async (req, res) => {
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

// For showing the room status to the owner
const roomStatus = (async (req, res) => {
    try {
        const id = req.query.id
        const room = await Rooms.findById(id)

        res.render("calender", {
            checkInDates: JSON.stringify(room.checkIn),
            checkOutDates: JSON.stringify(room.checkOut)
        });

    } catch (error) {
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
    addRoom,
    submitRoom,
    viewRooms,
    roomStatus,

    isAvaillable,
    editRoom,
    updateRoom,
    discount,
}