import User from "../../model/userModel.js"
import Owner from "../../model/ownerModel.js"
import Hotel from "../../model/hotelModel.js"
import Rooms from "../../model/roomsModel.js"
import adminRevenuew from "../../model/adminRevenue.js"


// To show the admin dashboard and the information
const dashboard = async (req, res) => {
    try {
        const [No_of_users, No_of_owners, No_of_hotels, No_of_rooms, revenue] = await Promise.all([
            User.find().count(),
            Owner.find().count(),
            Hotel.find().count(),
            Rooms.find().count(),
            adminRevenuew.find().populate("owner")
        ]);

        res.render("adminDashboard", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.status(404).render("404");
                } else {
                    return res.status(500).render("500");
                }
            }

            res.render("adminDashboard", {
                users: No_of_users,
                owners: No_of_owners,
                hotels: No_of_hotels,
                rooms: No_of_rooms,
                revenue,
            });
        })
    } catch (error) {
        return res.status(500).render("500");
    }
};

// For showing the information in the chart about when the user joined 
const userRegistrationChart = async (req, res) => {
    try {
        const { view } = req.query;

        let groupByTimeUnit;
        switch (view) {
            case 'year':
                groupByTimeUnit = '$year';
                break;
            case 'month':
                groupByTimeUnit = '$month';
                break;
            case 'week':
                groupByTimeUnit = '$week';
                break;
            default:
                groupByTimeUnit = '$month';
                break;
        }

        const registrationData = await User.aggregate([
            {
                $group: {
                    _id: {
                        timeUnit: { [groupByTimeUnit]: '$joinedAt' },
                    },
                    count: { $sum: 1 },
                },
            },
            {
                $sort: {
                    '_id.timeUnit': 1,
                },
            },
        ]);

        const labels = [];
        const registrationCount = [];

        registrationData.forEach((data) => {
            labels.push(`${data._id.timeUnit}`);
            registrationCount.push(data.count);
        });

        res.json({ labels, registrationCount });
    } catch (err) {
        console.error('Error fetching user registration data:', err.message);
        res.status(500).json({ error: 'Failed to fetch user registration data' });
    }
}


export default {
    dashboard,
    userRegistrationChart,
}