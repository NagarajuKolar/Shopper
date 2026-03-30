import express from "express";
const router = express.Router();

import { addproducts, getproducts,searchproducts,getcategory } from "../controllers/Productcontroller.js";
// import authmiddleware from "../middleware/Auth.js";
import { authmiddleware, adminMiddleware } from "../middleware/Auth.js";

// routes
router.post("/products", authmiddleware, adminMiddleware, addproducts);
router.get("/products", getproducts);
router.get("/products/search", searchproducts);
router.get("/categories",getcategory)


export default router;
