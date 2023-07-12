import jwt from "jsonwebtoken"


const login = ((req, res) => {
    try {
        res.render("adminLogin", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.status(404).render("404");
                } else {
                    return res.status(500).render("serverError");
                }
            }
            res.render("adminLogin", { admin: true })
        })
    } catch (error) {
        return res.status(500).render("serverError");
    }
})

const loginVerify = ((req, res) => {

    const admin = {
        email: "admin@gmail.com",
        password: "Admin1234"
    }

    try {
        const { email, password } = req.body

        if (email != admin.email) {

            return res.status(401).json({ error: "Unauthorized Admin" })
        }
        else if (password != admin.password) {

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

const logout = ((req, res) => {

    try {
        delete req.session.admintoken
        res.redirect("/admin")
    } catch (error) {
        return res.status(500).render("serverError");
    }

})



export default {
    login,
    loginVerify,
    logout,
}