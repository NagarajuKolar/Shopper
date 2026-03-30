import express from "express"
import User from "../Models/User.model.js";
import Eachproduct from "../Models/Eachproduct.model.js";
import Cartmodel from "../Models/Cart.model.js";
import Wishlistmodel from "../Models/Wishlist.model.js";
import Product from "../Models/product.model.js";

const addwishlist = async (req, res) => {
    const userId = req.user.id;
    const { productId } = req.body;
    console.log("BODY ", req.body);
    console.log("PRODUCT ID ", productId);


    try {
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        let wishlist = await Wishlistmodel.findOne({ user: userId });

        if (!wishlist) {
            wishlist = await Wishlistmodel.create({
                user: userId,
                wishitems: [],
            });
        }

        const exists = wishlist.wishitems.find(
            (i) => i.product.toString() === productId
        );

        if (exists) {
            return res.status(400).json({ message: "Item already in wishlist" });
        }

        wishlist.wishitems.push({ product: productId });

        await wishlist.save();

        res.status(200).json({
            message: "Item added to wishlist",
            wishlist,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};


const getwishlistitems = async (req, res) => {
    const userid = req.user.id;
    try {
        const items = await Wishlistmodel.findOne({ user: userid }).populate("wishitems.product")
        res.status(200).json({
            message: "Fetched wishlist items successfully",
            items,
        });
    }
    catch (error) {
        console.error("server error");
        res.status(500).json({ message: "Server Error" })
    }
}

const deletewishitems = async (req, res) => {
    const userid = req.user.id
    const { productId } = req.params;
    if (!productId) {
        return res.status(400).json({ message: "Product ID missing" });
    }

    try {
        const wishlistitemtodelete = await Wishlistmodel.findOne({ user: userid });

        if (!wishlistitemtodelete) {
            return res.status(404).json({
                message: "Wishlist not found",
            });
        }

        wishlistitemtodelete.wishitems = wishlistitemtodelete.wishitems.filter(
            (item) => item.product.toString() !== productId
        );
        await wishlistitemtodelete.save();


        return res.status(200).json({
            message: "Successfully removed from wishlist",
            wishlistitemtodelete,
        });
    }
    catch (error) {
        console.error("server error");
        res.status(500).json({ message: "Server Error" })
    }
}



export { addwishlist, getwishlistitems, deletewishitems };