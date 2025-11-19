// controllers/productController.js
import Product from "../models/Products.js";

// Format product safely - works with string _id (UUID) or MongoDB ObjectId
const formatProduct = (p) => {
  const productId = p._id?.toString ? p._id.toString() : String(p._id);
  
  return {
    id: productId,  // Send _id as 'id' for frontend
    _id: productId, // Also send as _id for backwards compatibility
    title: p.title || p.name || "",
    img: p.img || p.image || "",
    price: p.price || 0,
    category: p.category || "",
    description: p.description || "",
    rating: p.rating || 0,
    brand: p.brand || "",
    stock: p.stock || 0,
    trending: p.trending || false,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
};

// GET all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().lean();
    console.log("📦 [getAllProducts] Found", products.length, "products in DB");
    
    if (products.length > 0) {
      console.log("📦 [getAllProducts] First product from DB:", products[0]);
    }

    const mapped = products.map((p) => formatProduct(p));
    
    if (mapped.length > 0) {
      console.log("✅ [getAllProducts] First product after formatting:", mapped[0]);
    }

    console.log("📤 [getAllProducts] Sending", mapped.length, "products to frontend");
    return res.json(mapped);
  } catch (err) {
    console.error("❌ Error in getAllProducts:", err);
    return res.status(500).json({ message: "Server Error" });
  }
};

// GET trending products
export const getTrendingProducts = async (req, res) => {
  try {
    let products = await Product.find({ trending: true }).lean();

    if (products.length === 0) {
      products = await Product.find().limit(8);
    }

    const mapped = products.map((p) => formatProduct(p));
    return res.json(mapped);
  } catch (err) {
    console.error("❌ Error in getTrendingProducts:", err);
    return res.status(500).json({ message: "Server Error" });
  }
};
