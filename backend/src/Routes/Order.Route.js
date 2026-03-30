import express from 'express'
const router=express.Router()
import { adminMiddleware, authmiddleware } from "../middleware/Auth.js";
import { Postorder,GetAllOrdersInfo,GetSuccessOrder,SearchOrderProducts,CancelOrder,getorderdetails, 
    GetAdminAllOrdersInfo,getAdminorderdetails,UpdateOrderStatus} from '../controllers/Ordercontroller.js';

router.post('/postorder',authmiddleware,Postorder)
router.get('/order-success/:orderId',authmiddleware,GetSuccessOrder)
router.get('/order-details/:orderId',authmiddleware,getorderdetails)
router.post('/cancel-order/:orderId',authmiddleware,CancelOrder)
router.get('/order-summary',authmiddleware,GetAllOrdersInfo )
router.get("/search",authmiddleware, SearchOrderProducts);
//admin
router.get('/admin/allorders',authmiddleware,adminMiddleware,GetAdminAllOrdersInfo)
router.get('/admin/order-details/:orderId',authmiddleware,adminMiddleware,getAdminorderdetails);
router.patch('/admin/update-status/:orderId',authmiddleware,adminMiddleware,UpdateOrderStatus)


export default router;