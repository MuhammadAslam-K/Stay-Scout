import Hotel from "../../model/hotelModel.js"
import Rooms from "../../model/roomsModel.js"


const home = (async (req, res) => {

    const banner = await Hotel.find().sort({ booste: -1 }).limit(2)
    const hotel = await Hotel.find().sort({ booste: -1 }).skip(2).limit(2)
    const rooms = await Rooms.find().sort({ booste: -1 }).limit(6)
    console.log(rooms)

    try {
        res.render("home", { banner, hotel, rooms })

    } catch (error) {
        console.log(error);
    }
})

const profile = (async (req, res) => {
    try {
        const user = req.session.user
        res.render("profile", { user: user })

    } catch (error) {
        console.log(error);
    }

})

const hotels = async (req, res) => {

    const hotel = await Hotel.find().sort({ booste: -1 })

    try {
        res.render("userViewHotels", { hotel })
    } catch (error) {
        console.log(error);
    }

}

const hotelHome = (async (req, res) => {

    const id = req.query.id
    const hotel = await Hotel.findById(id)


    try {
        res.render("hotelHome", { hotel })
    } catch (error) {
        console.log(error);
    }

})

export default {
    home,
    profile,
    hotels,
    hotelHome
}