import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },

  items: [
    {
      productId: { type: String, required: true },
      title: String,
      price: Number,
      quantity: Number,
      size: String,
      img: String
    }
  ],

  totalINR: Number,
  status: { type: String, default: "Ordered" },

  cancelledReason: String,
  cancelledAt: Date,
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
