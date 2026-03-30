import express from "express";
const router = express.Router();
import { authmiddleware } from "../middleware/Auth.js";

import {
  registerUser,
  loginUser,
  aboutPage,
  logoutUser,
  getAllUsers,
  checkAuthentication,
  addAdress,editAdress,deleteAdress,getAdress
} from "../controllers/Usercontroller.js";

// routes
router.get("/about", aboutPage);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users", getAllUsers);
router.post("/logout", logoutUser);
router.post('/addAdress',authmiddleware,addAdress);
router.get('/getadress',authmiddleware,getAdress);
router.put('/editAdress/:index',authmiddleware,editAdress);
router.delete('/delAdress/:index',authmiddleware,deleteAdress)
router.get("/checkauthentication", checkAuthentication);

export default router;
