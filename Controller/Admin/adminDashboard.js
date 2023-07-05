import User from "../../model/userModel.js"
import Owner from "../../model/ownerModel.js"
import Hotel from "../../model/hotelModel.js"
import Rooms from "../../model/roomsModel.js"



const dashboard = async (req, res) => {
    try {
        const [No_of_users, No_of_owners, No_of_hotels, No_of_rooms] = await Promise.all([
            User.find().count(),
            Owner.find().count(),
            Hotel.find().count(),
            Rooms.find().count()
        ]);

        res.render("adminDashboard", {
            users: No_of_users,
            owners: No_of_owners,
            hotels: No_of_hotels,
            rooms: No_of_rooms
        });
    } catch (error) {
        console.log(error);
    }
};


export default {
    dashboard,
}