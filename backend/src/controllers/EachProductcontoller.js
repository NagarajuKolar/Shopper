import Eachproduct from "../Models/Eachproduct.model.js";
import Product from "../Models/product.model.js";

const addEachproductinfo = async (req, res) => {
  const {
    product,  //   product _id 
    Productdesc,
    actualprice,
    discountprice,
    availablesizes,
    category,
    subcategory,
  } = req.body;

  try {

    const foundproduct = await Product.findById(product);

    if (!foundproduct) {
      return res.status(404).json({
        message: "Product not found. Please create product first.",
      });
    }

    const existingEachProduct = await Eachproduct.findOne({ product });

    if (existingEachProduct) {
      return res.status(400).json({
        message: "EachProduct already exists for this product.",
      });
    }

    const newEachproduct = await Eachproduct.create({
      product,
      Productdesc,
      actualprice,
      discountprice,
      availablesizes,
      category,
      subcategory,
    });

    res.status(201).json({
      message: "EachProduct added successfully",
      data: newEachproduct,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const geteachproduct = async (req, res) => {
  try {
    const slug = req.params.slug;

    const prod = await Product.findOne({ slug });
    console.log("product slug", prod);

    if (!prod) {
      return res.status(404).json({ message: "Product not found" });
    }


    const eachProduct = await Eachproduct.findOne({ product: prod._id })
      .populate("product");

    console.log("each product", eachProduct);

    if (!eachProduct) {
      return res.status(404).json({
        message: "Each product details not found",
      });
    }
    res.status(200).json(eachProduct);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




export default {
  addEachproductinfo,
  geteachproduct
};
