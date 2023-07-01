import express from "express"
import morgan from "morgan"
import dotenv from "dotenv"
import session from "express-session"
import { v4 as uuidv4 } from 'uuid'
import path from "path"
import { fileURLToPath } from 'url'
import hbs from "hbs"


import user_route from "./Routers/userRoute.js"
import owner_route from "./Routers/ownerRoute.js"
import superAdmin_route from "./Routers/superAdminRoute.js"
import connect from "./config/mongodbConnection.js"


dotenv.config({ path: "config.env" })
const app = express()
const port = process.env.PORT || 3000
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);



/** Middleware */
app.set("view engine", "hbs")
// app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use("/img", express.static(path.join(__dirname, "public/img")))
app.use("/js", express.static(path.join(__dirname, "public/js")))
app.use("/plugins", express.static(path.join(__dirname, "public/plugins")))
app.use("/styles", express.static(path.join(__dirname, "public/styles")))
app.use("/images", express.static(path.join(__dirname, "public/images")))


app.use(session({
    secret: uuidv4(),
    saveUninitialized: true,
    resave: false
}))


hbs.registerPartials(path.join(__dirname, '/views/partials'))

app.use("/", user_route)
app.use("/owner", owner_route)
app.use("/superadmin", superAdmin_route)

hbs.registerPartials(path.join(__dirname, '/views/partials'))

connect().then(() => {
    try {
        app.listen(port, () => console.log(`App listening on port http://localhost:${port}`))

    } catch (error) {
        console.log("Unable to connect to the server");
    }
})