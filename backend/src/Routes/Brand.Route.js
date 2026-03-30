import express from 'express'
const router=express.Router()
import { adminMiddleware,authmiddleware } from '../middleware/Auth.js'
import {addBrands,getbrands,getpopularBrands} from '../controllers/Brandcontroller.js'

router.post('/add',authmiddleware,adminMiddleware,addBrands)
router.get('/getpopular',getpopularBrands)
router.get('/getallbrands',getbrands)


export default router