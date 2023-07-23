import express from "express"

import adminAuth from "../Controller/Admin/adminAuth.js"
import adminDashboard from "../Controller/Admin/adminDashboard.js"
import userManagement from "../Controller/Admin/userManagement.js"
import ownerManagement from "../Controller/Admin/ownerManagement.js"
import hotelManagement from "../Controller/Admin/hotelManagement.js"
import roomManagement from "../Controller/Admin/roomManagement.js"
import amenitiesManagement from "../Controller/Admin/amenitiesManagement.js"
import roomAmenitiesManagement from "../Controller/Admin/roomAmenitiesManagement.js"
import messageManagement from "../Controller/Admin/messageManagement.js"
import cancellationManagement from "../Controller/Admin/cancellationManagement.js"
import report from "../Controller/Admin/report.js"
import auth from "../middleware/adminAuth.js"



const admin_route = express()
admin_route.set("views", "./views/admin");
const { islogout, isLogged } = auth


///////////////LOGIN//////////
admin_route.get("/", islogout, adminAuth.login)
admin_route.post("/", islogout, adminAuth.loginVerify)
admin_route.get("/logout", isLogged, adminAuth.logout)


//////////////DASHBOARD///////////
admin_route.get("/dashboard", isLogged, adminDashboard.dashboard)


/////////////USER MANAGEMENT//////////
admin_route.get("/users", isLogged, userManagement.viewUser)
admin_route.post("/users/block", isLogged, userManagement.blockUser)


///////////////Owner MANAGEMENT/////////////
admin_route.get("/owners", isLogged, ownerManagement.viewowner)
admin_route.post("/owners/block", isLogged, ownerManagement.blockowner)

/////////HOTELS////////
admin_route.get("/owner/hotels", isLogged, hotelManagement.ownerHotels)
admin_route.post("/hotel/block", isLogged, hotelManagement.blockHotel)
admin_route.post("/hotel/boost", isLogged, hotelManagement.hotelBoosting)
admin_route.get("/hotel/approval", isLogged, hotelManagement.hotelForApproval)
admin_route.post("/hotel/approval", isLogged, hotelManagement.hotelForApproval_post)
admin_route.get("/hotel/viewdetails", isLogged, hotelManagement.hotelDetails)

////////ROOMS///////////
admin_route.get("/owner/hotel/rooms", isLogged, roomManagement.ownerRooms)
admin_route.post("/owner/hotel/room/edit", isLogged, roomManagement.blockRoom)
admin_route.post("/room/boost", isLogged, roomManagement.roomBoosting)

admin_route.get("/room/approval", isLogged, roomManagement.roomForApproval)
admin_route.post("/room/approval", isLogged, roomManagement.roomForApproval_post)
admin_route.get("/room/details", isLogged, roomManagement.roomDetails)


///////////////HOTEL Amenities///////////
admin_route.get('/hotel/amenities', isLogged, amenitiesManagement.amenities)
admin_route.post('/hotel/addamenities', isLogged, amenitiesManagement.addAmenities)
admin_route.post('/hotel/editamenities', isLogged, amenitiesManagement.editAmenities)
admin_route.post('/hotel/deleteamenities', isLogged, amenitiesManagement.deleteAmenities)

//////////ROOM AMENITIES///////////////
admin_route.get('/room/amenities', isLogged, roomAmenitiesManagement.amenities)
admin_route.post('/room/addamenities', isLogged, roomAmenitiesManagement.addAmenities)
admin_route.post('/room/editamenities', isLogged, roomAmenitiesManagement.editAmenities)
admin_route.post('/room/deleteamenities', isLogged, roomAmenitiesManagement.deleteAmenities)

////////////////ROOM CANCELLATION/////////////
admin_route.get('/room/cancellation', isLogged, cancellationManagement.cancellation)
admin_route.post('/room/addCancellation', isLogged, cancellationManagement.addCancellation)
admin_route.post('/room/editCancellation', isLogged, cancellationManagement.editCancellation)
admin_route.post('/room/deleteCancellation', isLogged, cancellationManagement.deleteCancellation)

////////////MESSAGE MANAGEMENT///////////
admin_route.get('/messages', isLogged, messageManagement.message)
admin_route.get('/message/delete', isLogged, messageManagement.messageDelete)

//////////////REPORTS//////////////////
admin_route.get("/report", isLogged, report.report)
admin_route.get("/report/delete", isLogged, report.deleteReport)
admin_route.get("/report/deltails", isLogged, report.reportDetails)





export default admin_route