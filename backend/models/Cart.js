import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  items: [
    {
      productId: { type: String, required: true }, // UUID or ObjectId as string
      title: String,
      price: Number,
      img: String,
      quantity: { type: Number, default: 1 },
      size: String,
    }
  ]
}, { timestamps: true });

export default mongoose.model("Cart", cartSchema);
