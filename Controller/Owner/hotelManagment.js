import cloudinary from "../../config/cloudinary.js"
import Hotel from "../../model/hotelModel.js"
import propertyValidation from "../../helper/propertyValidation.js"
import Type from "../../model/hotelType.js"
import Amenities from "../../model/hotelAmenities.js"



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


const submitHotel = (async (req, res) => {
    try {
        console.log(req.body);
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
            console.log(70);
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
                owner: req.session.owner._id,
                images: hotelImages
            })
            const result = await hotel.save()
            console.log(result);
            return res.send(200).end()
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error Please Try agin later" })
    }
})


const blockHotel = (async (req, res) => {
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


const editHotel = async (req, res) => {
    try {
        const id = req.query.id
        req.session.HOTELID = id
        const hotel = await Hotel.findById(id)
        const type = await Type.find()
        const amenities = await Amenities.find()


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


const updateHotel = (async (req, res) => {
    console.log(141);
    try {
        const id = req.session.HOTELID
        const hotel = await Hotel.findById(id)
        const files = req.files
        const hotelImages = []
        let amenities = []
        const oldImages = req.body.selectedImages
        console.log(req.body);
        const valid = propertyValidation.hotelValidation(req.body)

        console.log(valid);
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

            console.log(req.body);
            const { name, title, startingPrice, type, newtype, city, oldAmenities, newAmenities, pincode, description, address } = req.body

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
                amenities = [...oldAmenities, newAmenities]
            }
            else {
                amenities = [...oldAmenities]
            }

            hotel.name = name
            hotel.title = title
            hotel.startingPrice = startingPrice
            hotel.city = city
            hotel.pincode = pincode
            hotel.description = description
            hotel.address = address
            hotel.type = typeId
            hotel.images = images
            hotel.amenities = amenities

            const reu = await hotel.save()
            console.log(reu);
            return res.status(200).end()
        }
    } catch (error) {
        console.log(error);
        res.render("500")
    }

})








export default {
    addHotel,
    submitHotel,

    blockHotel,
    editHotel,
    updateHotel,
}