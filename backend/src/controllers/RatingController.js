import User from "../Models/User.model.js";
import Product from "../Models/product.model.js";
import Order from "../Models/Order.model.js";
import Rating from "../Models/Rating.model.js";

const addReview = async (req, res) => {
    const { productId } = req.params;
    const { rating, review, } = req.body;
    const images = req.files ? req.files.map((file) => file.filename) : [];//req.files contains Multer metadata and filesystem paths. I only store filenames or URLs in the database to
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const isOrdered = await Order.findOne({
            user: userId,
            "orderItems.product": productId,
            orderStatus: { $in: ["delivered", "returned"] },
        });

        if (!isOrdered) {
            return res.status(403).json({ message: "You can only review purchased products" });
        }
        const alreadyReviewed = await Rating.findOne({
            user: userId,
            product: productId,
        });


        if (alreadyReviewed) {
            return res.status(400).json({
                message: "You have already reviewed this product",
            });
        }

        const newRating = await Rating.create({
            user: userId,
            product: productId,
            rating,
            review,
            images,
        });
        const totalReviews = product.totalNumreviews || 0;
        const currentAvg = product.avgrating || 0;

        const newavgrating =(currentAvg * totalReviews + Number(rating)) / (totalReviews + 1);
        product.avgrating = newavgrating;
        product.totalNumreviews = product.totalNumreviews + 1;
        await product.save()

        return res.status(201).json({
            message: "Review added successfully",
            rating: newRating,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
};

export { addReview };
