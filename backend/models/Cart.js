import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  items: [
    {
      id: { type: String, required: true },  // Changed to String to support UUID and MongoDB ObjectId as strings
      title: String,
      price: Number,
      img: String,
      quantity: { type: Number, default: 1 },
    }
  ]
}, { timestamps: true });

export default mongoose.model("Cart", cartSchema);
