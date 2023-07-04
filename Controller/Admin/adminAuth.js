import jwt from "jsonwebtoken"


const login = ((req, res) => {

    try {
        res.render("adminLogin", { admin: true })
    } catch (error) {
        console.log(error)
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
        console.log(error)
    }

})

const logout = ((req, res) => {

    try {
        delete req.session.admintoken
        res.redirect("/admin")
    } catch (error) {
        console.log(error)
    }

})



export default {
    login,
    loginVerify,
    logout,
}