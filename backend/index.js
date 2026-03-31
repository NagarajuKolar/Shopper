import express, { json } from "express";
import dotenv from "dotenv";
import { connect } from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";

import userRoutes from "./src/Routes/User.Route.js";
import productRoutes from "./src/Routes/Product.Route.js";
import ProfileRoutes from "./src/Routes/Profile.Route.js";
import EachproductRoutes from "./src/Routes/Eachproduct.Route.js";
import ViewcartRoutes from './src/Routes/Cart.Route.js';
import WishlistRoutes from './src/Routes/Wishlist.Route.js';
import OrderRoutes from './src/Routes/Order.Route.js';
import RatingRoutes from './src/Routes/Rating.Route.js';
import BrandingRoutes from './src/Routes/Brand.Route.js';
import AdminRoutes from './src/Routes/Admin.Route.js'

const app = express();
dotenv.config();


const PORT = process.env.PORT || 3000;
const MongoDB_Url = process.env.Mongo_Url;


// middlewares
app.use(json());
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:5173",
             "http://localhost:5174",
             "https://shopper-phi-two.vercel.app",
            process.env.FRONTEND_URL ],
    credentials: true,
  })
);


// Database
async function connectDB() {
  try {
    await connect(MongoDB_Url);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

connectDB();

app.get("/", (req, res) => {
  res.send("Home Page");
});

// Routes
app.use("/api/user", userRoutes);
app.use('/api/cart', ViewcartRoutes)
app.use("/api", productRoutes);
app.use("/api", ProfileRoutes);
app.use("/api", EachproductRoutes);
app.use("/api/wishlist", WishlistRoutes)
app.use("/api/order", OrderRoutes)
app.use("/api", RatingRoutes);
app.use('/api/brands', BrandingRoutes)
app.use('/api/admin', AdminRoutes)

app.use((req, res) => {
  res.status(404).send("404 Not Found");
});

app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}`);
});
