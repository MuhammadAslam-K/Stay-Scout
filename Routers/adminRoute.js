import express from "express"

import adminAuth from "../Controller/Admin/adminAuth.js"
import adminDashboard from "../Controller/Admin/adminDashboard.js"
import userManagement from "../Controller/Admin/userManagement.js"
import ownerManagement from "../Controller/Admin/ownerManagement.js"
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
admin_route.post("/user", userManagement.searchUser)
admin_route.post("/users/edit", userManagement.updateUser)


///////////////Owner MANAGEMENT/////////////
admin_route.get("/owners", ownerManagement.viewowner)
admin_route.post("/owner", ownerManagement.searchOwner)
admin_route.post("/owners/edit", ownerManagement.updateowner)

/////////HOTELS////////
admin_route.get("/owner/hotels", ownerManagement.ownerHotels)
admin_route.post("/hotel/edit", ownerManagement.blockHotel)
admin_route.post("/owner/hotel/search", ownerManagement.searchHotel)

////////ROOMS///////////
admin_route.get("/owner/hotel/rooms", ownerManagement.ownerRooms)
admin_route.get("/owner/hotel/room/filter", ownerManagement.RoomFilter)

admin_route.post("/owner/hotel/room/edit", ownerManagement.blockRoom)






export default admin_route