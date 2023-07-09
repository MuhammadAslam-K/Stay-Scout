import express from "express"
import upload from "../middleware/multer.js"
import ownerLogin from "../Controller/Owner/ownerLogin.js"
import ownerSignup from "../Controller/Owner/ownerSignup.js"
import Auth from "../middleware/ownerAuthentication.js"
import hotelManagment from "../Controller/Owner/hotelManagment.js"
import roomManagement from "../Controller/Owner/roomManagement.js"
import dashboard from "../Controller/Owner/dashboard.js"
const { isLogged, islogout } = Auth


const owner_route = express()
owner_route.set("views", "./views/owner");


///////////////////LOGIN///////////////
owner_route.get("/", islogout, ownerLogin.login)
owner_route.post("/", islogout, ownerLogin.loginVerify)
owner_route.get("/logout", isLogged, ownerLogin.logout)


///////////////////SIGNUP/////////////////
owner_route.get('/signup', islogout, ownerSignup.signUp)
owner_route.post('/signup', islogout, ownerSignup.signupValidate)
owner_route.get("/otp", islogout, ownerSignup.enterOtp)
owner_route.post("/submitOtp", islogout, ownerSignup.verifyOtp)


/////////////////DASHBOARD////////////////
owner_route.get("/dashboard", dashboard.dashboard)
owner_route.get("/hotels", dashboard.viewHotels)

/////////////////HOTEL MANAGEMENT////////////
owner_route.get("/addhotel", hotelManagment.addHotel)
owner_route.post("/addhotel", upload.array('image', 4), hotelManagment.submitHotel)

owner_route.post("/hotel/edit", hotelManagment.blockHotel)
owner_route.get("/hotel/view", hotelManagment.editHotel)


///////////// ROOM MANAGEMENT///////////////
owner_route.get("/hotel/addrooms", roomManagement.addRoom)
owner_route.post("/hotel/addrooms", upload.array('image', 4), roomManagement.submitRoom)




export default owner_route