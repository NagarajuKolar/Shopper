import jwt from "jsonwebtoken";
import user from "../Models/User.model.js";

const generatetoken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      name: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
};

export default generatetoken;
