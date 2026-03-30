import mongoose from "mongoose";

const profileschema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    coverImage: {
      type: String,
    },
    age: {
      type: Number,
    },
    bio: {
      type: String,
    },
    sociallinks: {
      facebook: String,
      twitter: String,
      instagram: String,
    },
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", profileschema);

export default Profile;
