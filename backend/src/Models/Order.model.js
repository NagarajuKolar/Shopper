import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },


    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        productname: String,
        priceofeach: Number,
        quantity: Number,
        size: String,
      },
    ],


    shippingAddress: {
      name: String,
      address: String,
      pincode: String,
      phone: String,
      additionalInfo: String,
    },


    totalAmount: {
      type: Number,
      required: true,
    },


    paymentMethod: {
      type: String,
      enum: ["COD", "UPI", "CARD"],
      required: true,
    },


    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },


    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled", "returned"],
      default: "pending",
    },

    //cancellation//
    
    cancelReason: {
      type: String,
    },

    cancelledAt: {
      type: Date,
    },

    cancelledBy: {
      type: String,
      enum: ["user", "admin"],
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);
export default Order;
