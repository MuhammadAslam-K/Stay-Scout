import cloudinary from "../../config/cloudinary.js"
import Hotel from "../../model/hotelModel.js"
import propertyValidation from "../../helper/propertyValidation.js"
import Type from "../../model/hotelType.js"
import { ReturnDocument } from "mongodb"




const addHotel = (async (req, res) => {
    try {
        const type = await Type.find()

        res.render("addHotel", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.status(404).render("404");
                } else {
                    return res.status(500).render("500");
                }
            }
            res.render("addHotel", { type: type })
        })
    } catch (error) {
        return res.status(500).render("500");
    }
})


const submitHotel = (async (req, res) => {
    // console.log(req.body);
    try {

        const files = req.files;
        const hotelImages = [];
        const valid = propertyValidation.hotelValidation(req.body)

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

            const { name, title, startingPrice, type, newtype, city, pincode, description, address } = req.body
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
            // const ownerId = "64a2cbca876756d2ce1864bb"
            const hotel = new Hotel({
                name,
                title,
                description,
                startingPrice,
                type: typeId,
                city,
                pincode,
                address,
                owner: req.session.owner._id,
                // owner: ownerId,
                images: hotelImages
            })
            console.log(hotel);
            await hotel.save()
            return res.send(200).end()
        }
    } catch (error) {
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
        return res.status(500).render("500");
    }
})


const editHotel = async (req, res) => {
    try {
        const id = req.query.id
        req.session.HOTELID = id
        const hotel = await Hotel.findById(id)
        const type = await Type.find()

        res.render("editHotel", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.status(404).render("404");
                } else {
                    return res.status(500).render("500");
                }
            }
            res.render("editHotel", { hotel, type })
        })
    } catch (error) {
        return res.status(500).render("500");
    }
}


const updateHotel = (async (req, res) => {

    try {
        const id = req.session.HOTELID
        const files = req.files
        const hotelImages = []
        const oldImages = req.body.selectedImages

        const valid = propertyValidation.hotelValidation(req.body)
        let h = true
        if (h == false) {

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

            const convertedArray = oldImages.map((urlString) => {
                const url = urlString.split(':')[1].trim();
                return { url };
            });
            const images = [...hotelImages, ...convertedArray]

            // console.log(images)

            const hotel = await Hotel.findById(id)

            const { name, title, startingPrice, type, newtype, city, pincode, description, address } = req.body
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

            hotel.name = name
            hotel.title = title
            hotel.startingPrice = startingPrice
            hotel.city = city
            hotel.pincode = pincode
            hotel.description = description
            hotel.address = address
            hotel.images = images

            await hotel.save()
            return res.status(200).end()
        }
    } catch (error) {
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