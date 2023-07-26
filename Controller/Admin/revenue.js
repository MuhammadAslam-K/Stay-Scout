import Booking from "../../model/bokingModel.js";
import adminRevenue from "../../model/adminRevenue.js";



const adminRevenueChart = async (req, res) => {
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

        const revenueData = await Booking.aggregate([
            {
                $group: {
                    _id: {
                        timeUnit: { [groupByTimeUnit]: '$bookedAt' },
                    },
                    revenue: { $sum: '$paymentAmount' },
                },
            },
            {
                $sort: {
                    '_id.timeUnit': 1,
                },
            },
        ]);

        const labels = [];
        const revenue = [];

        revenueData.forEach((data) => {
            labels.push(`${data._id.timeUnit}`);
            revenue.push(data.revenue);
        });

        res.json({ labels, revenue });
    } catch (err) {
        console.error('Error fetching revenue data:', err.message);
        res.status(500).json({ error: 'Failed to fetch revenue data' });
    }
};


const ownerRevenue = async (req, res) => {

    try {
        const { view } = req.query;
        const ownerId = req.session.OwnerID
        const bookings = await Booking.find({ owner: ownerId }).select('bookedAt paymentAmount').sort({ bookedAt: 1 });

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
            groupedData[timeUnit] += booking.paymentAmount;
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
    adminRevenueChart,
    ownerRevenue,
}