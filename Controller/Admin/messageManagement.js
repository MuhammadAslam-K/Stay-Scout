import Message from "../../model/contact.js";

// Render the message that is sented by the users
const message = (async (req, res) => {

    try {
        const message = await Message.find().populate("user")
        res.render("message", { message })
    } catch (error) {
        res.render("500")
    }

})

// can delete the messages
const messageDelete = (async (req, res) => {

    try {
        const id = req.query.id
        await Message.findByIdAndDelete(id)
        res.redirect("/admin/messages")
    } catch (error) {
        res.render("500")
    }

})


export default {
    message,
    messageDelete,
}