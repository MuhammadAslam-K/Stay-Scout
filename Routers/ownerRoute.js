import express from "express"
import ownerAuth from "../Controller/Owner/ownerAuthController.js"
import upload from "../middleware/multer.js"
import hotelManagment from "../Controller/owner/hotelManagment.js"


const owner_route = express.Router()


///////////////LOGIN//////////
owner_route.get("/", ownerAuth.login)
owner_route.post("/", ownerAuth.loginVerify)
owner_route.get("/logout", ownerAuth.logout)


///////////SIGNUP//////////
owner_route.get('/signup', ownerAuth.signUp)
owner_route.post('/otp', ownerAuth.sendOtp)
owner_route.get("/otp", ownerAuth.enterOtp)
owner_route.post("/submitOtp", ownerAuth.verifyOtp)


/////////////////DASHBOARD////////////////
owner_route.get("/dashboard", ownerAuth.dashboard)

/////////////////HOTEL MANAGEMENT////////////
owner_route.get("/addhotel", hotelManagment.addHotel)
// owner_route.post("/addhotel", hotelManagment.addHotel)
owner_route.post("/addhotel", upload.single("image"), hotelManagment.submitHotel)
owner_route.get("/hotels", hotelManagment.viewHotels)




export default owner_route