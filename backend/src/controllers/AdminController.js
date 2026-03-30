import User from "../Models/User.model.js";
import Product from "../Models/product.model.js";
import Order from "../Models/Order.model.js";

const dashboardSummary = async (req, res) => {
    try {
        const pendingstatuses = ["pending", "confirmed"];
        const users = await User.find();
        const totalUsers = users.length;
        const products = await Product.find();
        const totalProducts = products.length;
        const orders = await Order.find();
        const totalOrders = orders.length;
        const pendingOrdersData = await Order.find({ orderStatus: { $in: pendingstatuses } });
        const pendingOrders = pendingOrdersData.length;

        //  Orders Today 
        const startOfToday = new Date(); //2026-03-05 12:30:15
        startOfToday.setHours(0, 0, 0, 0);//2026-03-05 00:00:00 gte midnight
        const ordersTodayData = await Order.find({ createdAt: { $gte: startOfToday } });
        const ordersToday = ordersTodayData.length;

        //total revenue
        const revenueOrders = await Order.find({
                orderStatus: { $nin: ["cancelled", "returned"] }
            });
        let totalRevenue = 0;
        revenueOrders.forEach((order) => {
            totalRevenue += order.totalAmount;
        });

        //  Orders Growth (Weekly)
        const now = new Date();
        const startOfThisWeek = new Date();
        startOfThisWeek.setDate(now.getDate() - 7);
        const startOfLastWeek = new Date(); startOfLastWeek.setDate(now.getDate() - 14);
        const ordersThisWeek = await Order.find({ 
            createdAt: { $gte: startOfThisWeek } 
        });
        const ordersLastWeek = await Order.find({ 
            createdAt: { $gte: startOfLastWeek, $lt: startOfThisWeek } 
        });
        let ordersGrowth = 0;
        if (ordersLastWeek.length > 0) {
            ordersGrowth = ((ordersThisWeek.length - ordersLastWeek.length) / ordersLastWeek.length) * 100;
        }

        // month growth
        const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);//Feb 1, 2026
        const End = new Date(now.getFullYear(), now.getMonth(), 1);//Mar 1, 2026 00:00:00
        const revenueLastMonthOrders = await Order.find({
            createdAt: {
                $gte: start,
                $lt: End
            },
            orderStatus: { $nin: ["cancelled", "returned"] }
        });
        const revenueThisMonthOrders = await Order.find({//for percentage growth until now
            createdAt: { $gte: End },
            orderStatus: { $nin: ["cancelled", "returned"] }
        });
        let revenueThisMonth = 0;
        let revenueLastMonth = 0;
        revenueThisMonthOrders.forEach((order) => {
            revenueThisMonth += order.totalAmount;

        });
        revenueLastMonthOrders.forEach((order) => {
            revenueLastMonth += order.totalAmount;
        });
        let Growth = 0;
        if (revenueLastMonth > 0) {
            Growth = ((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100;

        }
        res.status(200).json({
            totalUsers,
            totalProducts,
            totalOrders,
            pendingOrders,
            ordersToday,
            totalRevenue,
            revenueThisMonth,
            ordersGrowth: ordersGrowth.toFixed(2),
            revenueGrowth: Growth.toFixed(2)
        });
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" })

    }

}

export { dashboardSummary }