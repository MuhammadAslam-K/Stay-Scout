import Hotel from "../../model/hotelModel.js"
import Type from "../../model/hotelType.js"
import Amenities from "../../model/hotelAmenities.js"

import propertyFetching from "../../helper/propertyFetching.js"
import propertyValidation from "../../helper/propertyValidation.js"
import cloudinary from "../../config/cloudinary.js"


// For displaying the hotel to the owners
const viewHotels = (async (req, res) => {
    try {
        const ownerId = req.token.index._id
        const hotel = await propertyFetching.hotel(ownerId, 0, 0, false)

        res.render("viewHotels", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.status(404).render("404");
                } else {
                    return res.status(500).render("500");
                }
            }
            res.render("viewHotels", { hotel })
        })
    } catch (error) {
        console.log(error);
        return res.status(500).render("500");
    }
})

// Render the add hotel page
const addHotel = (async (req, res) => {
    try {
        const type = await Type.find()
        const amenities = await Amenities.find()

        res.render("addHotel", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.status(404).render("404");
                } else {
                    return res.status(500).render("500");
                }
            }
            res.render("addHotel", { type, amenities })
        })
    } catch (error) {
        console.log(error);
        return res.status(500).render("500");
    }
})

// Validate and save the new hotel data
const submitHotel = (async (req, res) => {
    try {
        const files = req.files;
        const hotelImages = [];
        const valid = propertyValidation.hotelValidation(req.body)

        console.log(valid);
        if (!valid.isValid) {
            return res.status(400).json({ error: valid.errors })
        } else {

            for (const file of files) {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: "Hotels"
                });

                const image = {
                    url: result.secure_url
                };

                hotelImages.push(image);
            }

            const { name, title, startingPrice, type, newtype, city, amenities, latitude, longitude, pincode, description, address } = req.body

            const latitudeData = parseFloat(latitude[0]);
            const longitudeData = parseFloat(longitude[0]);
            let typeId
            if (type == "new" && newtype) {
                const newTypeData = new Type({
                    name: newtype
                })
                const savedType = await newTypeData.save()
                typeId = savedType._id
            }
            else {
                typeId = type
            }

            const hotel = new Hotel({
                name,
                title,
                description,
                startingPrice,
                type: typeId,
                city,
                pincode,
                amenities,
                address,
                latitude: latitudeData,
                longitude: longitudeData,
                owner: req.token.index._id,
                images: hotelImages
            })
            const result = await hotel.save()

            return res.send(200).end()
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error Please Try agin later" })
    }
})

// The owner can make the hotel available or not to user
const availability = (async (req, res) => {
    try {
        const id = req.query.id

        const hotel = await Hotel.findById(id)
        hotel.is_Available = !hotel.is_Available

        await hotel.save()
        res.send(200).end()

    } catch (error) {
        console.log(error);
        return res.status(500).render("500");
    }
})


// Render the page for editing the hotel
const editHotel = async (req, res) => {
    try {
        const id = req.query.id
        req.session.HOTELID = id

        const [hotel, type, amenities] = await Promise.all([
            Hotel.findById(id),
            Type.find(),
            Amenities.find(),
        ])

        res.render("editHotel", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.status(404).render("404");
                } else {
                    return res.status(500).render("500");
                }
            }
            res.render("editHotel", { hotel, type, amenities })
        })
    } catch (error) {
        console.log(error);
        return res.status(500).render("500");
    }
}


// Validate the edited data and update it
const updateHotel = (async (req, res) => {

    try {
        const id = req.session.HOTELID
        const files = req.files
        const hotelImages = []
        let amenities = []
        const oldImages = req.body.selectedImages
        const valid = propertyValidation.hotelValidation(req.body)  // Validate the informations

        if (!valid.isValid) {
            return res.status(400).json({ error: valid.errors })
        }
        else {
            for (const file of files) {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: "Hotels"
                });

                const image = {
                    url: result.secure_url
                };

                hotelImages.push(image);
            }


            const images = hotelImages.concat(oldImages.map((url) => ({ url })));

            const { name, title, startingPrice, type, newtype, city, oldAmenities, newAmenities, pincode, description, address, latitude, longitude } = req.body
            let typeId

            if (type == "new" && newtype) {
                const newTypeData = new Type({
                    name: newtype
                })
                const savedType = await newTypeData.save()
                typeId = savedType._id
            }
            else {
                typeId = type
            }

            if (newAmenities) {

                amenities = [...oldAmenities, ...newAmenities]
            }
            else {

                amenities = [...oldAmenities]
            }

            const hotel = await Hotel.findByIdAndUpdate(
                id,
                { name, title, startingPrice, city, pincode, description, type: typeId, images, amenities, address, latitude, longitude },
                { new: true }
            )

            return res.status(200).end()
        }
    } catch (error) {
        console.log(error);
        res.render("500")
    }

})




export default {
    viewHotels,

    addHotel,
    submitHotel,

    availability,
    editHotel,
    updateHotel,
}