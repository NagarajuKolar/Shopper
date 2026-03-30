import express from "express"
import User from "../Models/User.model.js";
import Eachproduct from "../Models/Eachproduct.model.js";
import Cartmodel from "../Models/Cart.model.js";


const getcartitems = async (req, res) => {
    const userId = req.user.id;
    try {
        const fcartitems = await Cartmodel.findOne({ user: userId })
            .populate("items.product")
            .populate("items.eachproduct");
        // console.log(fcartitems)

        res.status(200).json({
            message: "Fetched cart items successfully",
            fcartitems,
        });
    }
    catch (error) {
        res.status(500).json({ message: "server error" })
    }

}

const addcartitems = async (req, res) => {
    const { eachproductId, size, quantity } = req.body;
    console.log("cart BODY:", req.body);

    const userId = req.user.id;
    try {
        const item = await Eachproduct.findById(eachproductId).populate("product")
        if (!item) {
            return res.status(404).json({ message: "item not found" });
        }
        if (!item.availablesizes.includes(size)) {
            return res.status(400).json({ message: "Invalid size selected" });
        }
        const qty = quantity ? Number(quantity) : 1;


        let cart = await Cartmodel.findOne({ user: userId })
        if (!cart) {
            cart = await Cartmodel.create({
                user: userId,
                items: [],
            });
        }

        const existingitem = cart.items.find((i) =>
            i.eachproduct.toString() === eachproductId &&
            i.size === size
        );

        if (existingitem) {
            existingitem.quantity += qty;
        } else {
            cart.items.push({
                product: item.product._id,
                // productname:item.product.productname,
                eachproduct: item._id,
                size,
                quantity: qty,
                priceofeach: item.discountprice,
            });
        }

        await cart.save();

        return res.status(200).json({
            message: "Item added to cart",
            cart,
        });
    }

    catch (error) {
        console.error("add to cart error", error);
        res.status(500).json({ message: "server error" })

    }

}

const deletecartitem = async (req, res) => {
  const userid = req.user.id;
  const { eachproductid } = req.params;

  if (!eachproductid) {
    return res.status(400).json({ message: "eachproductId is required" });
  }

  try {
    const cartitem = await Cartmodel.findOne({ user: userid });

    if (!cartitem) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cartitem.items = cartitem.items.filter(
      (item) => item.eachproduct.toString() !== eachproductid
    );

    await cartitem.save();

    return res.status(200).json({
      message: "Successfully removed from cart",
      cartitem,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export { getcartitems, addcartitems, deletecartitem };