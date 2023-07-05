import User from "../../model/userModel.js"

const viewUser = (async (req, res) => {
    try {
        const userDetails = await User.find()
        res.render("viewUser", { users: userDetails })

    } catch (error) {
        console.log(error)
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

        res.render("viewUser", { users: users })

    } catch (error) {
        console.log(error)
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
        console.log(error)
    }

})



export default {
    viewUser,
    searchUser,
    updateUser,
}