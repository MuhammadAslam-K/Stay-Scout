import Cancellation from "../../model/cancellation.js";


// Render the cancellation policy page
const cancellation = (async (req, res) => {
    try {
        const cancellation = await Cancellation.find()
        res.render("addCancellation", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.status(404).render("404");
                } else {
                    return res.status(500).render("500");
                }
            }
            res.render("addCancellation", { cancellation })
        })

    } catch (error) {
        return res.status(500).render("500");
    }
})

// validate and create new cancellation policy
const addCancellation = (async (req, res) => {
    try {
        const cancelation = req.body.cancellationName
        const existingCancellation = await Cancellation.find({ cancellation: cancelation })

        if (existingCancellation.length != 0) {
            return res.status(400).json({ error: "This Cancellation Policy exists" })
        }
        else {
            const cancellation = new Cancellation({ cancellation: cancelation })
            await cancellation.save()

            return res.status(200).end()
        }
    } catch (error) {
        res.status(500).render("500")
    }
})

// update the cancellation policy
const editCancellation = (async (req, res) => {
    try {
        const id = req.body.id
        const cancellation = req.body.updatedPolicy
        await Cancellation.findByIdAndUpdate(id, { cancellation: cancellation })

        return res.status(200)
    } catch (error) {
        res.status(500).render("500")
    }
})

// Delete the cancellation policy
const deleteCancellation = (async (req, res) => {
    try {
        const id = req.query.id
        await Cancellation.findByIdAndDelete(id)
        res.redirect("/admin/room/cancellation")

    } catch (error) {
        console.log(error);
        res.render("500")
    }

})




export default {
    cancellation,
    addCancellation,
    editCancellation,
    deleteCancellation,
}