import mongoose from "mongoose";

const SignatureSchema = new mongoose.Schema({
  id: Number,
  sku: String,
  slug: String,
  title: String,
  tagline: String,
  description: String,
  craftDetails: String,
  artisanName: String,
  limitedEdition: Boolean,
  editionCount: Number,
  images: [String],
  macroShots: [String],
  category: String,
  subCategory: String,
  fabric: String,
  occasion: String,
  genderFocus: String,
  price: Number,
  currency: String,
  colors: [String],
  sizes: [String],
  signatureBadge: String,
  embroideryDetails: String,
  weightGrams: Number,
  dimensionsCm: {
    length: Number,
    width: Number,
  },
  care: String,
  stock: Number,
  rating: Number,
  reviewsCount: Number,
  createdAt: String,
  updatedAt: String
});

export default mongoose.model("Signature", SignatureSchema);
