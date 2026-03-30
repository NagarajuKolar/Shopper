

import express from "express";
import { authmiddleware } from "../middleware/Auth.js";
import { getcartitems, addcartitems, deletecartitem } from "../controllers/Cartcontroller.js";

const router = express.Router();


router.post("/add", authmiddleware, addcartitems);
router.get("/fetch", authmiddleware, getcartitems);
router.delete('/:eachproductid',authmiddleware,deletecartitem)

export default router; 

