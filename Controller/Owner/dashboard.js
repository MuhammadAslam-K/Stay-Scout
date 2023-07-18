import propertyFetching from "../../helper/propertyFetching.js";
import owner from "../../model/ownerModel.js"
import Signup_functions from "../../helper/Signup_functions.js";



const dashboard = ((req, res) => {

    try {
        res.render("ownerDashboard", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.status(404).render("404");
                } else {
                    return res.status(500).render("500");
                }
            }
            res.render("ownerDashboard")
        })
    } catch (error) {
        console.log(error);
        return res.status(500).render("500");
    }
})


const viewHotels = (async (req, res) => {
    try {
        const ownerId = req.session.owner._id
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
            const { name, email, phone, password, bankName, accountNo, ifc } = req.body


            Owner.name = name;
            Owner.email = email;
            Owner.phone = phone;
            Owner.password = password;
            Owner.bankName = bankName;
            Owner.accountNo = accountNo;
            Owner.ifc = ifc;

            await Owner.save()
            return res.status(200).end()
        }

    } catch (error) {
        res.render("500")
    }

})

export default {
    viewHotels,
    dashboard,
    profile,
    profileUpdate
}