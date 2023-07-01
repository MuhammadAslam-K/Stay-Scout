import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config({ path: "config.env" })

async function connect() {
    try {
        // await mongoose.connect("mongodb://127.0.0.1:27017/stayScout")
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("DB Connected Successfully")
    } catch (error) {
        console.log(error);
        console.log("cannot connect");
    }
}

export default connect