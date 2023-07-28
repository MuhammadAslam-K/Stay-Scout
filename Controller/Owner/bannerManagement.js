import Banner from "../../model/banner.js"
import propertyValidation from "../../helper/propertyValidation.js"
import cloudinary from "../../config/cloudinary.js"
import Hotel from "../../model/hotelModel.js"
import Booking from "../../model/bokingModel.js"


// For viewing the banners
const viewBanners = (async (req, res) => {
    try {
        const ownerId = req.session.owner._id
        const banner = await Banner.find({ owner: ownerId }).populate("hotel")

        res.render("viewBanner", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.status(404).render("404");
                } else {
                    return res.status(500).render("500");
                }
            }
            res.render("viewBanner", { banner })
        })

    } catch (error) {
        console.log(error);
        res.render("500")
    }
})

// For adding new banner
const addBanner = async (req, res) => {
    console.log(32);
    try {
        const ownerId = req.session.owner._id
        const hotels = await Hotel.find({ owner: ownerId }).count()
        const banner = await Banner.find({ owner: ownerId }).count()

        let maxBanner = 3 * hotels

        if (banner < maxBanner) {
            return res.status(200).end()
        }
        else {
            return res.status(400).json({ error: "Please note that you have exceeded the limit. Delete any existing banners before adding new ones" })
        }
    } catch (error) {
        console.log(error);
        res.render("500")
    }
}


// To render the add banner page
const viewAddBanner = (async (req, res) => {
    console.log(56);
    try {
        const hotels = await Hotel.find({ owner: req.session.owner._id })
        res.render("addBanner", { hotels })
    } catch (error) {
        console.log(error);
        res.render("500")
    }
})


// For validate and create a new banner
const saveBanner = async (req, res) => {
    console.log(69);
    try {
        const { title, subtitle, hotelId, } = req.body
        const validate = propertyValidation.bannerValidate(req.body)
        const file = req.file
        console.log(validate)
        console.log(req.body);
        if (!validate.isValid) {
            return res.status(400).json({ error: validate.errors })
        }
        else {

            const result = await cloudinary.uploader.upload(file.path, {
                folder: "Banner"
            })

            const banner = new Banner({
                title,
                subtitle,
                image: { url: result.url },
                hotel: hotelId,
                linkTo: `/hotel/home?id=${hotelId}`,
                owner: req.session.owner._id
            })

            const bannerResult = await banner.save()
            console.log(bannerResult);
        }

        delete req.session.hotelBannerId
        res.status(200).end()

    } catch (error) {
        console.log(error);
        res.render("500")
    }
}

// Edit the banner 
const editBanner = async (req, res) => {
    try {
        const bannerId = req.query.id
        req.session.bannerId = bannerId
        const banner = await Banner.findById(bannerId)

        res.render("editBanner", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.status(404).render("404");
                } else {
                    return res.status(500).render("500");
                }
            }
            res.render("editBanner", { banner })
        })

    } catch (error) {
        console.log(error);
        res.render("500")
    }
}

// Update the banner changes
const updateBanner = async (req, res) => {
    try {
        const { titel, subtitel } = req.body
        const bannerId = req.session.bannerId
        const file = req.file
        let images = req.body.selectedImage
        const validate = propertyValidation.bannerValidate(req.body)

        if (images && file) {
            return res.status(500).json({ error: "The Banner can contain only one image" })
        }
        if (!validate.isValid) {
            return res.status(400).json({ error: valid.errors })
        }
        else {
            if (file) {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: "Banner"
                })
                images = result.url
            }
            await Banner.findByIdAndUpdate(
                bannerId,
                { titel, subtitel, image: { url: images } },
                { new: true }
            )
            return res.status(200).end()
        }

    } catch (error) {
        console.log(error);
        res.render("500")
    }
}


// Make the banner available or not
const availabile = async (req, res) => {
    try {
        const id = req.query.id;
        const banner = await Banner.findById(id);
        banner.available = !banner.available;

        await banner.save();
        res.status(200).json({ available: banner.available });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
};

// For deleting the Banner
const deleteBanner = async (req, res) => {
    try {
        const bannerId = req.query.id
        await Banner.findByIdAndDelete(bannerId)
        return res.status(200).end()

    } catch (error) {
        console.log(error);
        res.render("500")
    }
}

export default {
    viewBanners,
    addBanner,
    viewAddBanner,
    saveBanner,

    editBanner,
    updateBanner,

    availabile,
    deleteBanner,
}