import mongoose from "mongoose";

const RatingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    rating: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
      required: true,
    },

    review: {
      type: String,
    },

    images: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

const Rating = mongoose.model("Rating", RatingSchema);

export default Rating;
