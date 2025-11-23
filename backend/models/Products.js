import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // UUID compatibility
  title: { type: String, required: true },
  description: { type: String, default: "" },
  brand: { type: String, default: "" },
  category: { type: String, required: true },
  img: { type: String, default: "" },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  trending: { type: Boolean, default: false },

  // Additional categories as booleans
  Men: { type: Boolean, default: false },
  Women: { type: Boolean, default: false },
  Wedding: { type: Boolean, default: false },
  Signature: { type: Boolean, default: false },
  Discover: { type: Boolean, default: false },
  Western: { type: Boolean, default: false },
  Indian: { type: Boolean, default: false },
}, { timestamps: true }); // createdAt & updatedAt

export default mongoose.model("Product", productSchema);
