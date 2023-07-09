import Hotel from "../../model/hotelModel.js"


const home = (async (req, res) => {

    const banner = await Hotel.find().sort({ booste: -1 }).limit(2)
    const hotel = await Hotel.find().sort({ booste: -1 }).skip(2).limit(2)

    try {
        res.render("home", { banner, hotel })

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