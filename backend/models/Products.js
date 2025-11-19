import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  _id: { type: String, required: true },  // Explicitly define _id as String for UUID compatibility
  title: { type: String, required: true },
  description: { type: String, default: "" },
  brand: { type: String, default: "" },
  category: { type: String, required: true },
  img: { type: String, default: "" },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  trending: { type: Boolean, default: false },
}, { timestamps: true }); // creates createdAt & updatedAt

export default mongoose.model("Product", productSchema);
