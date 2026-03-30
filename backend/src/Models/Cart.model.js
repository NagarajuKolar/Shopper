import mongoose from "mongoose";
import Product from "./product.model.js";
import Eachproduct from "./Eachproduct.model.js";
import User from "./User.model.js";


const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, 
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        eachproduct: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "EachProduct",
          required: true,
        },

        size: {
          type: String,
          required: true,
        },

        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },

        priceofeach: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);




const Cartmodel=mongoose.model("Cartmodel",cartSchema);

export default Cartmodel