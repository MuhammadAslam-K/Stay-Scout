import owner from "../../model/ownerModel.js"
import Signup_functions from "../../helper/Signup_functions.js"
import Hotel from "../../model/hotelModel.js"
import Rooms from "../../model/roomsModel.js"



const dashboard = (async (req, res) => {

    try {
        const ownerId = req.session.owner
        const [hotels, rooms] = await Promise.all([
            Hotel.find({ owner: ownerId }).count(),
            Rooms.find({ owner: ownerId }).count()
        ]);
        // console.log(hotels, rooms, ownerId);

        res.render("ownerDashboard", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.status(404).render("404");
                } else {
                    return res.status(500).render("500");
                }
            }
            res.render("ownerDashboard", { revenue: req.session.owner.revenue, hotels, rooms })
        })
    } catch (error) {
        console.log(error);
        return res.status(500).render("500");
    }
})



const profile = async (req, res) => {

    try {
        const id = req.session.owner._id
        const Owner = await owner.findById(id)

        res.render("profile", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.status(404).render("404");
                } else {
                    return res.status(500).render("500");
                }
            }
            res.render("profile", { Owner })
        })


    } catch (error) {
        res.render("500")
    }

}

const profileUpdate = (async (req, res) => {

    try {
        const id = req.session.owner._id
        const Owner = await owner.findById(id)
        const valid = Signup_functions.Ownervalidate(false, req.body)

        if (!valid.isValid) {
            return res.status(409).json({ error: valid.errors })
        }
        else {
            const { name, email, phone, bankName, accountNo, ifc } = req.body

            const Owner = await owner.findByIdAndUpdate(
                id,
                { name, email, phone, bankName, accountNo, ifc },
                { new: true }
            )

            return res.status(200).end()
        }

    } catch (error) {
        res.render("500")
    }
})




export default {
    dashboard,
    profile,
    profileUpdate,

}