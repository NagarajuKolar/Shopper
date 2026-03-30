import mongoose from "mongoose";

const ProductSchema = mongoose.Schema({
  productname: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
  },
  desc: {
    type: String,
    unique: true,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  stock: {
    type: Number,
    default: 0,
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand",
    default: null,
  },
  image: {
    type: String,
  },
  avgrating: {
    type: Number,
    default: 0
  },
  totalNumreviews: {
    type: Number,
    default: 0
  }

});

const Product = mongoose.model("Product", ProductSchema);

export default Product;
