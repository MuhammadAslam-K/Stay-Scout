import User from "../../model/userModel.js"

const viewUser = (async (req, res) => {
    try {
        const userDetails = await User.find()
        res.render("viewUser", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.status(404).render("404");
                } else {
                    return res.status(500).render("serverError");
                }
            }
            res.render("viewUser", { users: userDetails })
        })

    } catch (error) {
        return res.status(500).render("serverError");
    }

})

const searchUser = (async (req, res) => {
    try {
        const value = req.body.search
        const regexValue = new RegExp(value, "i")

        const users = await User.find({
            $or: [
                { name: { $regex: regexValue } },
                { email: { $regex: regexValue } }
            ]
        });

        res.render("viewUser", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.status(404).render("404");
                } else {
                    return res.status(500).render("serverError");
                }
            }
            res.render("viewUser", { users: users })
        })

    } catch (error) {
        return res.status(500).render("serverError");
    }

})

const updateUser = (async (req, res) => {
    try {
        const id = req.query.id
        const user = await User.findById(id)

        user.is_block = !user.is_block
        await user.save()

        res.redirect("/admin/users")

    } catch (error) {
        return res.status(500).render("serverError");
    }

})



export default {
    viewUser,
    searchUser,
    updateUser,
}