import mongoose from "mongoose";
import Product from "./product.model.js";
import Eachproduct from "./Eachproduct.model.js";
import User from "./User.model.js";


const WishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, 
    },

    wishitems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        eachproduct: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "EachProduct",
        },
      },
    ],
  },
  { timestamps: true }
);




const Wishlistmodel=mongoose.model("Wishlistmodel",WishlistSchema);

export default Wishlistmodel