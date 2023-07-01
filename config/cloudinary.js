import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv"


dotenv.config({ path: "config.env" })

cloudinary.config({
    cloud_name: process.env.CLOUDE_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
})


export default cloudinary