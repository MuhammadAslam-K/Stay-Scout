import Banner from "../../model/banner.js"

const banner = async (req, res) => {
    try {
        const banner = await Banner.find().populate('owner').populate("hotel")
        res.render("viewBanners", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.status(404).render("404");
                } else {
                    return res.status(500).render("500");
                }
            }
            res.render("viewBanners", { banner })
        })

    } catch (error) {
        console.log(error);
        res.render("500")
    }
}

const visible = async (req, res) => {
    try {
        const { id, value } = req.query
        await Banner.findByIdAndUpdate(
            id,
            { active: value },
            { new: true }
        )
        res.redirect("/admin/banner")
    } catch (error) {
        console.log(error);
        res.render("500")
    }
}

const bannerDetails = async (req, res) => {
    try {
        const bannerId = req.query.id
        const banner = await Banner.findById(bannerId)

        res.render("viewBannerDetails", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.status(404).render("404");
                } else {
                    return res.status(500).render("500");
                }
            }
            res.render("viewBannerDetails", { banner })
        })
    } catch (error) {
        console.log(error);
        res.render("500")
    }
}


const deleteBanner = (async (req, res) => {
    try {
        const bannetId = req.query.id

        await Banner.findByIdAndDelete(bannetId)
        return res.status(200).end()

    } catch (error) {
        console.log(error);
        res.render("500")
    }
})

export default {
    banner,
    visible,
    bannerDetails,
    deleteBanner,
}