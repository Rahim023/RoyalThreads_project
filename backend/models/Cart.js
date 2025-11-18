import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  items: [
    {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      title: String,
      price: Number,
      img: String,
      quantity: { type: Number, default: 1 },
    }
  ]
}, { timestamps: true });

export default mongoose.model("Cart", cartSchema);
