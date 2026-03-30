import express from "express";
const router = express.Router();

import {
  postpersonalprofile,
  getmyprofile,
  updatemyprofile,
} from "../controllers/Profilecontroller.js";

import { authmiddleware } from "../middleware/Auth.js";

// Apply auth middleware to every route of this router
router.use("/profile", authmiddleware);

// profile routes
router.post("/profile/personalinfo", postpersonalprofile);
router.get("/profile/personalinfo", getmyprofile);
router.put("/profile/personalinfo", updatemyprofile);

export default router;
