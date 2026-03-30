import jwt from "jsonwebtoken";
import User from "../Models/User.model.js";

// const authmiddleware = async (req, res, next) => {
//     let token;
//     if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//         try {
//             token = req.headers.authorization.split(" ")[1] // Bearer <token>
//             const decoded = jwt.verify(token, process.env.JWT_SECRET);
//             // Attach user to request (excluding password)
//             // Find the user in DB using the decoded payload (id we stored when generating token)
//             req.user = await User.findById(decoded.id).select("-password");

//             next();
//         }
//         catch (error) {
//             res.status(401).json({ message: "Not authorized, token failed" });
//         }
//     }
//     if (!token) {
//         res.status(401).json({ message: "Not authorized, no token" });
//     }
// };

// with cookies
const authmiddleware = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // req.user = decoded.id; // or user info
    req.user = decoded; // entire decoded payload (id + role)//req.user.id I used mostly for checking evrywhere
    console.log(req.user);
    next();
  } catch (error) {
    console.error("authmiddleware error:", error);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

// admin middleware
const adminMiddleware = async (req, res, next) => {
  //   if (req.user.role !== "admin") {
  //   return res.status(403).json({ message: "Access denied. Admin only." });
  // }
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied: Admins only" });
  }
};

export { authmiddleware, adminMiddleware };
