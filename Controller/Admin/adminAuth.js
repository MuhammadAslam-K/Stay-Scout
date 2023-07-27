import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config({ path: "config.env" })

// Render the login page for the user
const login = ((req, res) => {
    try {
        res.render("adminLogin", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.status(404).render("404");
                } else {
                    return res.status(500).render("500");
                }
            }
            res.render("adminLogin", { admin: true })
        })
    } catch (error) {
        return res.status(500).render("500");
    }
})

// validate the admin information
const loginVerify = ((req, res) => {
    try {
        const { email, password } = req.body

        if (email != process.env.ADMIN_EMAIL) {
            return res.status(401).json({ error: "Unauthorized Admin" })
        }
        else if (password != process.env.ADMIN_PASSWORD) {
            return res.status(400).json({ error: "Wrong Password" })
        }
        else {
            const payload = { email: email }
            const token = jwt.sign(payload, process.env.SECRET_TOKEN, {
                expiresIn: "1h",
            })

            req.session.admintoken = token
            res.redirect("/admin/dashboard")
        }
    } catch (error) {
        return res.status(400).json({ error: "Internal Server error please try again later" })
    }

})

// delete the admin session while admin logout
const logout = ((req, res) => {
    try {
        delete req.session.admintoken
        res.redirect("/admin")

    } catch (error) {
        return res.status(500).render("500");
    }
})



export default {
    login,
    loginVerify,
    logout,
}