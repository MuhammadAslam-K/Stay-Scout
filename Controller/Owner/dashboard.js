import owner from "../../model/ownerModel.js"
import Hotel from "../../model/hotelModel.js"
import Rooms from "../../model/roomsModel.js"
import Booking from "../../model/bokingModel.js"

import Signup_functions from "../../helper/Signup_functions.js"
import Owner from "../../model/ownerModel.js"

// Render the dashboard for the owner
const dashboard = (async (req, res) => {
    console.log(11);
    try {
        const ownerId = req.token.index._id

        const [hotels, rooms, booking, owner] = await Promise.all([
            Hotel.find({ owner: ownerId }).count(),
            Rooms.find({ owner: ownerId }).count(),
            Booking.find({ owner: ownerId }).populate("hotel").populate("user").populate("room"),
            Owner.findById(ownerId),
        ]);

        res.render("ownerDashboard", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.status(404).render("404");
                } else {
                    return res.status(500).render("500");
                }
            }
            res.render("ownerDashboard", { revenue: owner.revenue, hotels, rooms, booking })
        })

    } catch (error) {
        console.log(error);
        return res.status(500).render("500");
    }
})

//  Render the owner profiel
const profile = async (req, res) => {
    try {
        const id = req.token.index._id
        const Owner = await owner.findById(id)

        res.render("profile", (err) => {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    return res.status(404).render("404");
                } else {
                    return res.status(500).render("500");
                }
            }
            res.render("profile", { Owner })
        })

    } catch (error) {
        res.render("500")
    }

}

// Save the updated information of the owner after editing the profile
const profileUpdate = (async (req, res) => {

    try {
        const id = req.token.index._id
        const Owner = await owner.findById(id)
        const valid = Signup_functions.validate(false, req.body) // Validate the information

        if (!valid.isValid) {
            return res.status(409).json({ error: valid.errors })
        }
        else {
            const { name, email, phone, bankName, accountNo } = req.body

            const Owner = await owner.findByIdAndUpdate(
                id,
                { name, email, phone, bankName, accountNo },
                { new: true }
            )

            return res.status(200).end()
        }

    } catch (error) {
        res.render("500")
    }
})


// For displaying the revenue chart
const revenueChart = async (req, res) => {
    try {
        const { view } = req.query;
        const ownerId = req.token.index._id;

        const bookings = await Booking.find({ owner: ownerId, refund: false }).select('bookedAt ownerAmount').sort({ bookedAt: 1 });

        const labels = [];
        const revenue = [];
        const groupedData = {};

        const getWeekNumber = (date) => {
            const onejan = new Date(date.getFullYear(), 0, 1);
            const weekNumber = Math.ceil(((date - onejan) / 86400000 + onejan.getDay() + 1) / 7);
            return weekNumber;
        };

        const getTimeUnit = (date) => {
            switch (view) {
                case 'year':
                    return date.getFullYear();
                case 'month':
                    return date.getMonth() + 1;
                case 'week':
                    return getWeekNumber(date);
                default:
                    return date.getMonth() + 1;
            }
        };

        bookings.forEach((booking) => {
            const timeUnit = getTimeUnit(booking.bookedAt);
            if (!groupedData[timeUnit]) {
                groupedData[timeUnit] = 0;
            }
            groupedData[timeUnit] += booking.ownerAmount;
        });

        for (const timeUnit in groupedData) {
            labels.push(timeUnit);
            revenue.push(groupedData[timeUnit]);
        }

        res.json({ labels, revenue });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch revenue data' });
    }
};



export default {
    dashboard,
    profile,
    profileUpdate,
    revenueChart,
}