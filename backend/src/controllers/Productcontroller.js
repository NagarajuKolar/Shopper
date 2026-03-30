import Product from "../Models/product.model.js";
import createSlug from "../utils/slug.js";
import EachProduct from "../Models/Eachproduct.model.js";
import Brand from "../Models/Brand.model.js";


const addproducts = async (req, res) => {
  const { productname, desc, price, stock, image, brand } = req.body;

  try {
    const product = await Product.create({
      productname,
      slug: createSlug(req.body.productname),
      desc,
      price,
      stock,
      image,
      brand

    });
    if (brand) {
      const brandproduct = await Brand.findById(brand);

      if (brandproduct) {
        brandproduct.productCount += 1;
        await brandproduct.save();
      }
    }


    res.status(201).json({
      message: "Product added",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to add" });
  }
};

const getproducts = async (req, res) => {
  const { brands, ratings } = req.query
  try {
    let filterquery = {}
    //brands
    if (brands) {
      const multiplebrands = brands.split(',');// convert "samsung,nike" → ["samsung","nike"]
      const brandDocs = await Brand.find({
        slug: { $in: multiplebrands },
      }).select("_id");
      const brandIds = brandDocs.map((b) => b._id);//conver to array
      filterquery.brand = { $in: brandIds };// filter products using brand ObjectIds
    }
    //ratings
    if (ratings) {
      const ratingValue = Number(ratings);
      // make sure it is valid
      if (!isNaN(ratingValue)) {

        // avgRating >= ratings
        filterquery.avgrating = { $gte: ratingValue };
      }
    }
    
    const allproducts = await Product.find(filterquery);
    res.status(201).json(allproducts);
  } catch (error) {
    res.status(500).json({ message: "fetching failed" });
  }
};

const searchproducts = async (req, res) => {//no user required all can search
  try {
    const { q } = req.query;

    if (!q || q.trim() === "") {
      return res.status(400).json({
        message: "Enter the search query",
      });
    }
    //from product
    const productsofproduct = await Product.find({
      productname: { $regex: q, $options: "i" },
    }).select("_id");

    const productIds = productsofproduct.map((p) => p._id);
    //from eachproduct after finding product(objectID) and also directly from eachproudt
    const completeresults = await EachProduct.find({
      $or: [
        { category: { $regex: q, $options: "i" } },//case insensitive (i)
        { subcategory: { $regex: q, $options: "i" } },
        { product: { $in: productIds } },
      ],
    }).populate("product");

    res.status(200).json(completeresults);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getcategory = async (req, res) => {
  try {
    const categories = await EachProduct.distinct("category");
    res.status(200).json(categories)

  }
  catch (error) {
    res.status(500).message({ message: "server Error" })
  }


}

export { addproducts, getproducts, searchproducts, getcategory };
