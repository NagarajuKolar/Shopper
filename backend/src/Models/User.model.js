import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
  {
    fullname: String,
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    mobile: { type: Number, unique: true },
    password: String,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    addresses: [
      {
        name: String,
        address: String,
        pincode: String,
        phone: String,
        additionalInfo: String,
      }
    ]
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
