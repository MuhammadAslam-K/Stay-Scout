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
admin_route.get("/dashboard", isLogged, adminDashboard.dashboard)


/////////////USER MANAGEMENT//////////
admin_route.get("/users", isLogged, userManagement.viewUser)
admin_route.post("/user", isLogged, userManagement.searchUser)
admin_route.post("/users/edit", isLogged, userManagement.updateUser)


///////////////Owner MANAGEMENT/////////////
admin_route.get("/owners", isLogged, ownerManagement.viewowner)
admin_route.post("/owner", isLogged, ownerManagement.searchOwner)
admin_route.post("/owners/edit", isLogged, ownerManagement.updateowner)


export default admin_route