import express from 'express'
import { authmiddleware } from "../middleware/Auth.js";
import { addwishlist,getwishlistitems,deletewishitems } from '../controllers/Wishcontroller.js';


const router=express.Router();
router.post("/",authmiddleware,addwishlist)
router.get('/wish',authmiddleware,getwishlistitems)
router.delete("/:productId", authmiddleware, deletewishitems);


export default router;