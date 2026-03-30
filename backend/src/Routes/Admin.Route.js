import express from 'express'
import { adminMiddleware, authmiddleware } from '../middleware/Auth.js'
import { dashboardSummary } from '../controllers/AdminController.js'
const router=express.Router()

router.get("/dashboard-summary",authmiddleware,adminMiddleware,dashboardSummary)

export default router