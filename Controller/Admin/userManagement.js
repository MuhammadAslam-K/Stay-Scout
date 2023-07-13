import User from "../../model/userModel.js"

const viewUser = (async (req, res) => {
    try {
        const userDetails = await User.find()
        res.render("viewUser", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.status(404).render("404");
                } else {
                    return res.status(500).render("500");
                }
            }
            res.render("viewUser", { users: userDetails })
        })

    } catch (error) {
        return res.status(500).render("500");
    }

})

const searchUser = (async (req, res) => {
    console.log(24);
    try {
        const value = req.body.search
        const regexValue = new RegExp(value, "i")

        const users = await User.find({
            $or: [
                { name: { $regex: regexValue } },
                { email: { $regex: regexValue } }
            ]
        });

        return res.send(users)
    } catch (error) {
        return res.status(500).render("500");
    }

})

const blockUser = (async (req, res) => {
    try {
        const id = req.query.id
        const user = await User.findById(id)

        user.is_block = !user.is_block
        await user.save()

        res.status(200).end()

    } catch (error) {
        return res.status(500).render("500");
    }

})



export default {
    viewUser,
    searchUser,
    blockUser,
}