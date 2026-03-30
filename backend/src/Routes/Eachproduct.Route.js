import express from "express";
const router = express.Router();
import EachProductController from "../controllers/EachProductcontoller.js";

const { addEachproductinfo,geteachproduct} = EachProductController;

// const { authmiddleware } = await import('../middleware/Auth.js');
// Apply auth middleware to every route of this router
// router.use(authmiddleware);

// Eachproduct routes
router.post("/addeachproduct", addEachproductinfo);
router.get("/:slug", geteachproduct);
// router.get("/getallproduct", getallproducts);

export default router;

