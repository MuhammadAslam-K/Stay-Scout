import Message from "../../model/contact.js";


const message = (async (req, res) => {

    try {
        const message = await Message.find().populate("user")
        res.render("message", { message })
    } catch (error) {
        res.render("500")
    }

})


export default {
    message,
}