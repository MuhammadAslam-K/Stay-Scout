import express from "express"

import adminAuth from "../Controller/Admin/adminAuth.js"
import userManagement from "../Controller/Admin/userManagement.js"
import ownerManagement from "../Controller/Admin/ownerManagement.js"
import auth from "../middleware/adminAuth.js"



const admin_route = express.Router()
const { isLogged } = auth


///////////////LOGIN//////////
admin_route.get("/", adminAuth.login)
admin_route.post("/", adminAuth.loginVerify)
admin_route.get("/logout", adminAuth.logout)


//////////////DASHBOARD///////////
admin_route.get("/dashboard", adminAuth.dashboard)


/////////////USER MANAGEMENT//////////
admin_route.get("/users", userManagement.viewUser)
admin_route.post("/user", userManagement.searchUser)
admin_route.post("/users/edit", userManagement.updateUser)


///////////////Owner MANAGEMENT/////////////
admin_route.get("/owners", ownerManagement.viewowner)
admin_route.post("/owner", ownerManagement.searchOwner)
admin_route.post("/owners/edit", ownerManagement.updateowner)


export default admin_route