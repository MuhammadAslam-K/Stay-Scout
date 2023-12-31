import Booking from "../../model/bokingModel.js";


// For showing the admin revenue
const adminRevenue = async (req, res) => {

    try {
        const { view } = req.query;

        const bookings = await Booking.find({ refund: false }).select('bookedAt adminAmount').sort({ bookedAt: 1 });
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
            groupedData[timeUnit] += booking.adminAmount;
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
}



// Shows the revenue of the owner
const ownerRevenue = async (req, res) => {

    try {
        const { view } = req.query;
        const ownerId = req.session.OwnerID
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
}



export default {
    // ownerRevenueChart,
    adminRevenue,
    ownerRevenue,
}