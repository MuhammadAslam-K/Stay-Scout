import express from "express"
import morgan from "morgan"
import dotenv from "dotenv"
import session from "express-session"
import cookieParser from "cookie-parser"
import { v4 as uuidv4 } from 'uuid'
import path from "path"
import { fileURLToPath } from 'url'
import hbs from "hbs"
import Handlebars from "hbs"
import passport from "passport"
import nocache from "nocache"
// import hbsHelper from "./helper/hbsHelper.js"

import user_route from "./Routers/userRoute.js"
import owner_route from "./Routers/ownerRoute.js"
import admin_route from "./Routers/adminRoute.js"
import connect from "./config/mongodbConnection.js"


dotenv.config({ path: "config.env" })
const app = express()
const port = process.env.PORT || 3000
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


/** Middleware */
app.set("view engine", "hbs")
// app.use(morgan("tiny"))
app.use(nocache());
app.use(express.json())
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }))
// app.use(errorRoute);



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

app.use(passport.initialize());
app.use(passport.session());




hbs.registerPartials(path.join(__dirname, '/views/partials'))

// Register the "times" helper
hbs.registerHelper('times', function (n, block) {
    let accum = '';
    for (let i = 0; i < n; i++) {
        accum += block.fn(i);
    }
    return accum;
});



app.use("/", user_route)
app.use("/owner", owner_route)
app.use("/admin", admin_route)
app.get('*', (req, res) => {
    res.render("404")
})



connect().then(() => {
    try {
        app.listen(port, () => console.log(`App listening on port http://localhost:${port}`))

    } catch (error) {
        console.log("Unable to connect to the server");
    }
})