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
owner_route.get("/hotels", isLogged, isBlocked, dashboard.viewHotels)

/////////////////HOTEL MANAGEMENT////////////
owner_route.get("/addhotel", isLogged, isBlocked, hotelManagment.addHotel)
owner_route.post("/addhotel", isLogged, isBlocked, upload.array('image', 4), hotelManagment.submitHotel)

owner_route.post("/hotel/block", isLogged, isBlocked, hotelManagment.blockHotel)
owner_route.get("/hotel/update", isLogged, isBlocked, hotelManagment.editHotel)
owner_route.post("/hotel/search", isLogged, isBlocked, hotelManagment.searchHotel)

///////////// ROOM MANAGEMENT///////////////
owner_route.get("/hotel/addrooms", isLogged, isBlocked, roomManagement.addRoom)
owner_route.post("/hotel/addrooms", isLogged, isBlocked, upload.array('image', 4), roomManagement.submitRoom)
owner_route.get("/rooms", isLogged, isBlocked, roomManagement.viewRooms)

owner_route.post("/room/block", isLogged, isBlocked, roomManagement.blockRoom)
owner_route.get("/room/filter", isLogged, isBlocked, roomManagement.filter)




export default owner_route