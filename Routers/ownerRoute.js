import express from "express"
import upload from "../middleware/multer.js"
import ownerLogin from "../Controller/Owner/ownerLogin.js"
import ownerSignup from "../Controller/Owner/ownerSignup.js"
import Auth from "../middleware/ownerAuthentication.js"
import hotelManagment from "../Controller/Owner/hotelManagment.js"
import roomManagement from "../Controller/Owner/roomManagement.js"
import dashboard from "../Controller/Owner/dashboard.js"
const { isLogged, islogout, isBlocked } = Auth


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
owner_route.get("/dashboard", isLogged, isBlocked, dashboard.dashboard)
owner_route.get("/profile", isLogged, isBlocked, dashboard.profile)
owner_route.post("/profile/edit", isLogged, isBlocked, dashboard.profileUpdate)
owner_route.get("/revenue", isLogged, isBlocked, dashboard.revenueChart)

/////////////////HOTEL MANAGEMENT////////////
owner_route.get("/hotels", isLogged, isBlocked, hotelManagment.viewHotels)
owner_route.get("/addhotel", isLogged, isBlocked, hotelManagment.addHotel)
owner_route.post("/addhotel", isLogged, isBlocked, upload.array('image', 4), hotelManagment.submitHotel)

owner_route.post("/hotel/block", isLogged, isBlocked, hotelManagment.availability)
owner_route.get("/hotel/update", isLogged, isBlocked, hotelManagment.editHotel)
owner_route.post("/hotel/edit", upload.array('image', 4), isLogged, isBlocked, hotelManagment.updateHotel)

///////////// ROOM MANAGEMENT///////////////
owner_route.get("/rooms", isLogged, isBlocked, roomManagement.viewRooms)
owner_route.get("/hotel/addrooms", isLogged, isBlocked, roomManagement.addRoom)
owner_route.post("/hotel/addrooms", isLogged, isBlocked, upload.array('image', 4), roomManagement.submitRoom)

owner_route.post("/room/block", isLogged, isBlocked, roomManagement.isAvaillable)
owner_route.get("/room/edit", isLogged, isBlocked, roomManagement.editRoom)
owner_route.get("/room/status", isLogged, isBlocked, roomManagement.roomStatus)
owner_route.post("/room/edit", isLogged, isBlocked, upload.array('image', 4), roomManagement.updateRoom)




export default owner_route