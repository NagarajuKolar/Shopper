import Brand from "../Models/Brand.model.js";
import User from "../Models/User.model.js";

const addBrands = async (req, res) => {
  const { name, logo, description, country, website } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.role !== "admin") return res.status(403).json({ message: "Not authorized" });

    const slugged = name.trim().toLowerCase().replace(/\s+/g, "-");

    const existingBrand = await Brand.findOne({
      $or: [{ name }, { slug: slugged }],
    });

    if (existingBrand) {
      return res.status(409).json({ message: "Brand already exists" });
    }

    const brand = await Brand.create({
      name,
      slug: slugged,
      logo,
      description,
      country,
      website,
    });

    res.status(201).json({
      message: "Brand added successfully",
      brands: brand,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// const getpopularBrands = async (req, res) => {
//   try {
//     const popularbrands = await Brand.find({
//       isActive:true,
//       productCount: { $gt: 2 } })
//     res.status(200).json({
//       message: "Fetched Popular brands",
//       popularbrands
//     })
//   }
//   catch (error) {
//     res.status(500).json({ message: "Error Server" })
//   }

// }

const getpopularBrands = async (req, res) => {
  try {
    const popularbrand = await Brand.find({
      isActiveBrand: true,
      $or: [
        { productCount: { $gt: 2 } },
        { totalSales: { $gt: 2 } }
      ]
    })
      .sort({ totalSales: -1, productCount: -1 }) // highestt priority sales  first
      .limit(12);

    res.status(200).json({
      message: "Fetched Popular brands",
      popularbrand
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};


const getbrands = async (req, res) => {
  try {
    const brands = await Brand.find()
    res.status(200).json({
      message: "Fetched Branch Succesfully",
      allBrands: brands
    })
  }
  catch (error) {
    res.status(500).json({ message: "Server Error " })
  }

}

export { addBrands, getpopularBrands, getbrands };
