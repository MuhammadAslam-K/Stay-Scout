import express from "express"

import superAdminAuth from "../Controller/superAdmin/superAdminAuth.js"
import userManagement from "../Controller/superAdmin/userManagement.js"
import ownerManagement from "../Controller/superAdmin/ownerManagement.js"
import auth from "../middleware/superAdminAuth.js"



const superAdmin_route = express.Router()
const { isLogged } = auth


///////////////LOGIN//////////
superAdmin_route.get("/", superAdminAuth.login)
superAdmin_route.post("/", superAdminAuth.loginVerify)
superAdmin_route.get("/logout", superAdminAuth.logout)


//////////////DASHBOARD///////////
superAdmin_route.get("/dashboard", superAdminAuth.dashboard)


/////////////USER MANAGEMENT//////////
superAdmin_route.get("/users", userManagement.viewUser)
superAdmin_route.post("/users/edit", userManagement.updateUser)


///////////////ADMIN MANAGEMENT/////////////
superAdmin_route.get("/owners", ownerManagement.viewowner)
superAdmin_route.post("/owners/edit", ownerManagement.updateowner)


export default superAdmin_route