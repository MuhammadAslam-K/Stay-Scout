import cloudinary from "../../config/cloudinary.js"
import Hotel from "../../model/hotelModel.js"
import propertyValidation from "../../helper/propertyValidation.js"
import Type from "../../model/hotelType.js"




const addHotel = (async (req, res) => {
    try {
        const type = await Type.find()

        res.render("addHotel", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.status(404).render("404");
                } else {
                    return res.status(500).render("serverError");
                }
            }
            res.render("addHotel", { type: type })
        })
    } catch (error) {
        return res.status(500).render("serverError");
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
                    public_id: result.public_id,
                    url: result.secure_url
                };

                hotelImages.push(image);
            }

            const { name, title, startingPrice, type, newtype, city, pincode, description, address } = req.body
            console.log(startingPrice);
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
        // res.redirect("/owner/hotels")
        res.send(200).end()

    } catch (error) {
        return res.status(500).render("serverError");
    }
})


const editHotel = async (req, res) => {
    try {
        const id = req.query.id
        const hotel = await Hotel.findById(id)

        res.render("editHotel", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.status(404).render("404");
                } else {
                    return res.status(500).render("serverError");
                }
            }
            res.render("editHotel", { hotel })
        })
    } catch (error) {
        return res.status(500).render("serverError");
    }
}

// const updateHotel = async (req, res) => {

//     try {

//         const id = req.body.id
//         const
//     } catch (error) {

//     }

// }


const searchHotel = (async (req, res) => {
    try {
        const value = req.body.search
        const regexValue = new RegExp(value, "i")
        const hotel = await Hotel.find({
            $or: [
                { name: { $regex: regexValue } }
            ]
        }).populate("type")

        res.send(hotel)

    } catch (error) {
        return res.status(500).render("serverError");
    }

})



export default {
    addHotel,
    submitHotel,
    blockHotel,
    editHotel,
    // updateHotel,

    searchHotel,
}