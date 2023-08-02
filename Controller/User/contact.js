import Message from "../../model/contact.js";
import jwt from "jsonwebtoken";


// Render the contact page
const contact = ((req, res) => {
    try {
        res.render("contact", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.render("404");
                } else {
                    return res.status(500).render("500");
                }
            }
            return res.status(200).render("contact")
        })
    } catch (error) {
        console.log(error);
        res.render("500")
    }
})

//  Submit the message to the admin
const submitContact = (async (req, res) => {
    try {
        const token = req.token
        const message = req.body.message
        const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
        const user = decodedToken.index._id
        const contact = new Message({ message, user })

        await contact.save()
        return res.status(200).end()

    } catch (error) {
        console.log(error);
        res.render("500")
    }
})


export default {
    contact,
    submitContact,
}