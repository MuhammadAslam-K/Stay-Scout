import express from "express"

import adminAuth from "../Controller/Admin/adminAuth.js"
import adminDashboard from "../Controller/Admin/adminDashboard.js"
import userManagement from "../Controller/Admin/userManagement.js"
import ownerManagement from "../Controller/Admin/ownerManagement.js"
import hotelManagement from "../Controller/Admin/hotelManagement.js"
import roomManagement from "../Controller/Admin/roomManagement.js"
import amenitiesManagement from "../Controller/Admin/amenitiesManagement.js"
import roomAmenitiesManagement from "../Controller/Admin/roomAmenitiesManagement.js"
import auth from "../middleware/adminAuth.js"



const admin_route = express()
admin_route.set("views", "./views/admin");
const { islogout, isLogged } = auth


///////////////LOGIN//////////
admin_route.get("/", islogout, adminAuth.login)
admin_route.post("/", islogout, adminAuth.loginVerify)
admin_route.get("/logout", isLogged, adminAuth.logout)


//////////////DASHBOARD///////////
admin_route.get("/dashboard", adminDashboard.dashboard)


/////////////USER MANAGEMENT//////////
admin_route.get("/users", userManagement.viewUser)
admin_route.post("/users/search", userManagement.searchUser)
admin_route.post("/users/block", userManagement.blockUser)


///////////////Owner MANAGEMENT/////////////
admin_route.get("/owners", ownerManagement.viewowner)
admin_route.post("/owners/search", ownerManagement.searchOwner)
admin_route.post("/owners/block", ownerManagement.blockowner)

/////////HOTELS////////
admin_route.get("/owner/hotels", hotelManagement.ownerHotels)
admin_route.post("/hotel/block", hotelManagement.blockHotel)
admin_route.post("/owner/hotel/search", hotelManagement.searchHotel)

////////ROOMS///////////
admin_route.get("/owner/hotel/rooms", roomManagement.ownerRooms)
admin_route.get("/owner/hotel/room/filter", roomManagement.filterRooms)

admin_route.post("/owner/hotel/room/edit", roomManagement.blockRoom)


///////////////HOTEL Amenities///////////
admin_route.get('/hotel/amenities', amenitiesManagement.amenities)
admin_route.post('/hotel/addamenities', amenitiesManagement.addAmenities)
admin_route.post('/hotel/editamenities', amenitiesManagement.editAmenities)
admin_route.post('/hotel/deleteamenities', amenitiesManagement.deleteAmenities)

//////////ROOM AMENITIES///////////////
admin_route.get('/room/amenities', roomAmenitiesManagement.amenities)
admin_route.post('/room/addamenities', roomAmenitiesManagement.addAmenities)
admin_route.post('/room/editamenities', roomAmenitiesManagement.editAmenities)
admin_route.post('/room/deleteamenities', roomAmenitiesManagement.deleteAmenities)

export default admin_route