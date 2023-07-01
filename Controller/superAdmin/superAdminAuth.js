import User from "../../model/userModel.js"
import Owner from "../../model/ownerModel.js"
import Hotel from "../../model/hotelModel.js"
import Rooms from "../../model/roomsModel.js"


const login = ((req, res) => {

    try {
        res.render("login")
    } catch (error) {
        console.log(error)
    }

})

const loginVerify = ((req, res) => {

    try {
        const { email, password } = req.body

        if (email != "admin@gmail.com") {
            res.render("login", { message: "Invalid EmailID" })
        } else if (password != "Admin1234") {
            res.render("login", { messsage: "Wrong Password" })
        } else {

            const token = jwt.sign(email, process.env.SECRET_TOKEN, {
                expiresIn: "1h",
            })

            req.session.superadmintoken = token
            res.redirect("/superadmin/dashboard")
        }
    } catch (error) {
        console.log(error)
    }

})

const logout = ((req, res) => {

    try {
        delete req.session.superadmintoken
        res.redirect("/superadmin")
    } catch (error) {
        console.log(error)
    }

})

const dashboard = (async (req, res) => {

    try {
        const No_of_users = await User.find().count()
        const No_of_owners = await Owner.find().count()
        const No_of_hotels = await Hotel.find().count()
        const No_of_rooms = await Rooms.find().count()
        res.render("superAdminDashboard", {
            users: No_of_users,
            owners: No_of_owners,
            hotels: No_of_hotels,
            rooms: No_of_rooms
        })
    } catch (error) {
        console.log(error)
    }

})

export default {
    login,
    loginVerify,
    logout,
    dashboard,
}