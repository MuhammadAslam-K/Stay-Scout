import mongoose from "mongoose"
import dotenv from "dotenv"
import Rooms from "../model/roomsModel.js"

dotenv.config({ path: "config.env" })

async function connect() {
    try {

        await mongoose.connect(process.env.MONGODB_URL)
        console.log("DB Connected Successfully")
    } catch (error) {
        console.log(error);
        console.log("cannot connect");
    }
}

async function removeOutdatedDates() {
    const currentDate = new Date();

    try {
        const result = await Rooms.updateMany(
            {
                "availableRooms.checkOut": { $lt: currentDate },
            },
            {
                $pull: {
                    "availableRooms.$[].checkIn": { $lt: currentDate },
                    "availableRooms.$[].checkOut": { $lt: currentDate },
                },
            }
        );

        console.log(`${result.nModified} documents updated.`);
    } catch (error) {
        console.error('Error removing outdated dates:', error);
    }
}

function getTimeUntilMidnight() {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    return midnight - now;
}

function scheduleRemoveOutdatedDates() {
    const timeUntilMidnight = getTimeUntilMidnight();
    setTimeout(async () => {
        await removeOutdatedDates();
        setInterval(removeOutdatedDates, 24 * 60 * 60 * 1000);
    }, timeUntilMidnight);
}

scheduleRemoveOutdatedDates();

export default {
    connect,
}