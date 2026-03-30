import mongoose from "mongoose";
import Product from "./product.model.js";

const EachproductSchema = mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    Productdesc: {
      type: String,
    },
    actualprice: {
      type: Number,
    },
    discountprice: {
      type: Number,
    },
    availablesizes: {
      type: [String],
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    subcategory: {
      type: String,
      required: true,
    },
  },
);

const EachProduct = mongoose.model("EachProduct", EachproductSchema);

export default EachProduct;
