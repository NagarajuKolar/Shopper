import express from 'express'
const router=express.Router()
import { addReview } from '../controllers/RatingController.js';
import { authmiddleware } from '../middleware/Auth.js';
import Imageupload from '../middleware/ImageUpload.js';

router.post("/product/:productId/write-review",authmiddleware,Imageupload.array("images", 5),addReview)


export default router;