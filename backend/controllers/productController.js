import Product from "../models/Products.js";

// Format product safely
const formatProduct = (p) => {
  const productId = p._id?.toString ? p._id.toString() : String(p._id);

  return {
    id: productId,
    _id: productId,
    title: p.title || p.name || "",
    img: p.img || p.image || "",
    price: p.price || 0,
    category: p.category || "",
    description: p.description || "",
    rating: p.rating || 0,
    brand: p.brand || "",
    stock: p.stock || 0,
    trending: p.trending || false,
    Men: p.Men || false,
    Women: p.Women || false,
    Wedding: p.Wedding || false,
    Signature: p.Signature || false,
    Discover: p.Discover || false,
    Western: p.Western || false,
    Indian: p.Indian || false,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
};

// GET all products (optionally filtered by category boolean fields)
export const getAllProducts = async (req, res) => {
  try {
    const { western, indian, men, women, wedding, signature, discover } = req.query;

    let filter = {};

    if (western === "true") filter.Western = true;
    if (indian === "true") filter.Indian = true;
    if (men === "true") filter.Men = true;
    if (women === "true") filter.Women = true;
    if (wedding === "true") filter.Wedding = true;
    if (signature === "true") filter.Signature = true;
    if (discover === "true") filter.Discover = true;

    const products = await Product.find(filter).lean();
    const mapped = products.map((p) => formatProduct(p));

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
