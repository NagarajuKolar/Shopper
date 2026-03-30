import User from "../Models/User.model.js";
import Product from "../Models/product.model.js";
import Order from "../Models/Order.model.js";
import Cart from "../Models/Cart.model.js"
import mongoose from "mongoose";


const Postorder = async (req, res) => {
    //search working order items through buynow and not working for through cart because
    //  snapshot is saving from buynow because we are sending it and not with cart we are sending product(objectId) it cannot
    //  manually create snapshot we need to create it
    const userId = req.user.id;
    const { shippingAddress, orderItems, paymentMethod, totalAmount, checkoutType } = req.body;
    try {
        const user = await User.findById(userId)
        if (!user) {
            return res.status(400).json({ message: "User Not Found" })
        }
        if (!shippingAddress || !orderItems || orderItems.length === 0 || !paymentMethod || !totalAmount) {
            return res.status(400).json({ message: "Bad request. Fill all required details" });
        }

        let calculatedTotal = 0;

        for (let item of orderItems) {
            const product = await Product.findById(item.product);

            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }

            calculatedTotal += product.price * item.quantity;
        }

        if (calculatedTotal !== totalAmount) {
            return res.status(400).json({
                message: "Total amount mismatch",
            });
        }

        const order = new Order({
            user: userId,
            orderItems,
            shippingAddress,
            totalAmount,
            paymentMethod,
            paymentStatus: "pending",
            orderStatus: "pending",
        });

        await order.save();

        if (checkoutType === 'cart') {
            await Cart.findOneAndUpdate({ user: userId }, { $set: { items: [] } })
        }

        res.status(201).json({
            message: "Order placed successfully",
            orderId: order._id,
        });
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({ message: "server error" })
    }

}

const GetSuccessOrder = async (req, res) => {
    const { orderId } = req.params;
    const userId = req.user.id;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "User Not Found" });
        }

        const order = await Order.findOne({
            _id: orderId,
            user: userId
        }).populate("orderItems.product", "productname image");

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json({
            orderId: order._id,
            orderItems: order.orderItems,
            shippingAddress: order.shippingAddress,
            totalAmount: order.totalAmount,
            paymentMethod: order.paymentMethod,
            paymentStatus: order.paymentStatus,
            orderStatus: order.orderStatus,
            createdAt: order.createdAt,
        });

    }
    catch (error) {
        res.status(500).json({ message: "Server Error" })
    }

}

const GetAllOrdersInfo = async (req, res) => {
    const userId = req.user.id;
    const { status } = req.query;
    console.log("STATUS QUERY:", status);
    try {
        const user = await User.findById(userId)
        if (!user) {
            return res.status(400).json({ message: "User Not Found" })
        }
        const queryConditions = { user: userId };

        if (status) { //if status then filter by status or else overall getallorders
            const statusArray = status.split(",");//for multiple split or else req.query.status === "cancelled,delivered" 
            // this becomes complete one  string that does not exist 
            queryConditions.orderStatus = { $in: statusArray };
        }

        const orders = await Order.find(queryConditions)
            .sort({ createdAt: -1 })
            .populate("orderItems.product", "productname image");


        res.status(200).json({ orders });
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" })
    }

}

const SearchOrderProducts = async (req, res) => {
    const userId = req.user.id;
    const { query } = req.query
    try {
        if (!query || query.trim() === "") {
            return res.status(400).json({
                message: "Enter the search query",
            });
        }
        const searchedOrders = await Order.find({
            user: userId,
            $or: [
                { paymentStatus: { $regex: query, $options: "i" } },
                { orderStatus: { $regex: query, $options: "i" } },
                { "orderItems.productname": { $regex: query, $options: "i" } },
            ],
        }).sort({ createdAt: -1 })//for latest
            .populate("orderItems.product", "image productname");//for image

        res.status(200).json({
            orders: searchedOrders,
        });

    }
    catch (error) {
        console.error("Search error:", error);
        res.status(500).json({ message: "Server error" });
    }

}


const CancelOrder = async (req, res) => {
    const { orderId } = req.params;
    const userId = req.user.id;
    const { cancelReason } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ message: "user not found" })
        }
        const order = await Order.findOne({ _id: orderId, user: userId })
        if (!order) {
            res.status(400).json({ message: "Order not found" })
        }

        const cancellableStatuses = ["pending", "confirmed"];

        if (!cancellableStatuses.includes(order.orderStatus)) {
            return res.status(400).json({
                message: `Order cannot be cancelled when status is ${order.orderStatus}`,
            });
        }
        order.orderStatus = 'cancelled';
        order.cancelledAt = new Date();
        order.cancelReason = cancelReason;
        order.cancelledBy = "user";

        await order.save();
        res.status(200).json({
            message: "order cancelled succesfully",
            order
        })

    }
    catch (error) {
        res.status(500).json({ message: "server eror" })
    }

}

const getorderdetails = async (req, res) => {
    const { orderId } = req.params;
    const userId = req.user.id;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "User Not Found" });
        }
        const order = await Order.findOne({
            _id: orderId,
            user: userId
        }).populate("orderItems.product", "productname image");
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json({
            message: "Fetched Order-details succesfully",
            orderdetail: order,
        })
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" })
    }
}

//Admin Controllers

const GetAdminAllOrdersInfo = async (req, res) => {
    const { status, search } = req.query;
    console.log("STATUS QUERY:", status);
    try {
        const queryConditions = {};
        const users = await User.find()

        if (status) { //if status then filter by status or else overall getallorders
            const statusArray = status.split(",");//for multiple split or else req.query.status === "cancelled,delivered" 
            // this becomes complete one  string that does not exist 
            queryConditions.orderStatus = { $in: statusArray };
        }
        if (search && search.trim() !== "") {

            const trimmedSearch = search.trim();

            const matchedproducts = await Product.find({
                productname: { $regex: trimmedSearch, $options: "i" }
            }).select("_id");

            const matchedproductIds = matchedproducts.map(p => p._id);

            const searchConditions = [
                { "orderItems.product": { $in: matchedproductIds } }
            ];

            if (mongoose.Types.ObjectId.isValid(trimmedSearch)) {
                searchConditions.push({ _id: trimmedSearch });
            }

            queryConditions.$or = searchConditions;
        }
        const orders = await Order.find(queryConditions)
            .sort({ createdAt: -1 })
            .populate("orderItems.product", "productname image");


        res.status(200).json({ orders });
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" })
    }

}

const getAdminorderdetails = async (req, res) => {
    const { orderId } = req.params;
    // const userId = req.user.id;
    try {
        // const user = await User.findById(userId);
        // if (!user) {
        //     return res.status(400).json({ message: "User Not Found" });
        // }
        const order = await Order.findOne({
            _id: orderId,
        }).populate("orderItems.product", "productname image");
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json({
            message: "Fetched Order-details succesfully",
            orderdetail: order,
        })
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" })
    }
}

const UpdateOrderStatus = async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    try {
        // status exists
        if (!status) {
            return res.status(400).json({ message: "Status is required" });
        }

        //  Allowed statuses 
        const allowedStatuses = [
            "pending",
            "confirmed",
            "shipped",
            "delivered",
            "cancelled",
            "returned",
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid order status" });
        }
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        //  Prevent same status update
        if (order.orderStatus === status) {
            return res.status(400).json({
                message: `Order is already marked as ${status}`,
            });
        }


        const validTransitions = {
            pending: ["confirmed", "shipped", "cancelled"],
            confirmed: ["shipped", "cancelled"],
            shipped: ["delivered"],
            delivered: ["returned"],
            cancelled: [],
            returned: [],
        };

        const currentStatus = order.orderStatus;

        if (!validTransitions[currentStatus].includes(status)) {
            return res.status(400).json({
                message: `Cannot change status from ${currentStatus} to ${status}`,
            });
        }


        //  Handle cancellation logic
        if (status === "cancelled") {
            order.cancelledAt = new Date();
            order.cancelledBy = "admin";
        }


        order.orderStatus = status;

        await order.save();

        res.status(200).json({
            message: "Order status updated successfully",
            updatedorder: order,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

export {
    Postorder, GetAllOrdersInfo, GetSuccessOrder, SearchOrderProducts, CancelOrder, getorderdetails,
    GetAdminAllOrdersInfo, getAdminorderdetails, UpdateOrderStatus
}