import Cart from "../models/Cart.js";
import Product from "../models/Products.js";
import Signature from "../models/Signature.js";   // <-- IMPORTANT

/**
 * Helper: Format cart items
 */
const formatCartItems = (items) => {
  return items.map((item) => ({
    id: String(item.id),
    title: item.title,
    price: item.price,
    img: item.img,
    quantity: item.quantity,
  }));
};

/**
 * POST /cart/add
 */
export const addToCart = async (req, res) => {
  try {
    console.log("🛒 addToCart request:", req.body);

    const { productId } = req.body;
    const userId = req.user._id;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "❌ 'productId' is required",
      });
    }

    const pid = String(productId);

    console.log("🔍 Searching product in Product collection:", pid);
    let product = await Product.findById(pid).lean();

    if (!product) {
      console.log("🔍 Not found. Searching in Signature collection:", pid);
      product = await Signature.findById(pid).lean();
    }

    if (!product) {
      console.log("❌ Product not found in ANY collection:", pid);
      return res.status(404).json({
        success: false,
        message: "❌ Product not found in database",
      });
    }

    console.log("✅ Product found:", product.title);

    // Prepare item to add to cart
    const cartItem = {
      id: String(product._id),
      title: product.title,
      price: product.price,
      img: product.images?.[0] || product.img || "",
      quantity: 1,
    };

    // Load or create user's cart
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      console.log("🧺 Creating new cart for user:", userId);
      cart = new Cart({ user: userId, items: [] });
    }

    // Check if item already exists
    const existingIndex = cart.items.findIndex(
      (item) => String(item.id) === String(cartItem.id)
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += 1;
      console.log("➕ Increased quantity for:", product.title);
    } else {
      cart.items.push(cartItem);
      console.log("🛍️ Added NEW item:", product.title);
    }

    await cart.save();
    console.log("💾 Cart saved successfully");

    return res.status(200).json({
      success: true,
      message: "✅ Product added to cart",
      items: formatCartItems(cart.items),
    });
  } catch (err) {
    console.error("❌ addToCart ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error adding to cart",
      error: err.message,
    });
  }
};

/**
 * GET /cart
 */
export const getCart = async (req, res) => {
  try {
    const userId = req.user._id;

    let cart = await Cart.findOne({ user: userId });

    if (!cart)
      return res.status(200).json({
        success: true,
        items: [],
      });

    return res.status(200).json({
      success: true,
      items: formatCartItems(cart.items),
    });
  } catch (err) {
    console.error("❌ getCart error:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error fetching cart",
      error: err.message,
    });
  }
};

/**
 * DELETE /cart/:id
 */
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const productId = String(req.params.id);

    let cart = await Cart.findOne({ user: userId });

    if (!cart)
      return res.status(200).json({
        success: true,
        items: [],
      });

    cart.items = cart.items.filter((item) => String(item.id) !== productId);
    await cart.save();

    return res.status(200).json({
      success: true,
      items: formatCartItems(cart.items),
    });
  } catch (err) {
    console.error("❌ removeFromCart error:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error removing from cart",
      error: err.message,
    });
  }
};

/**
 * DELETE /cart/clear
 */
export const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId });

    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.status(200).json({
      success: true,
      message: "✅ Cart cleared",
      items: [],
    });
  } catch (err) {
    console.error("❌ clearCart error:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error clearing cart",
      error: err.message,
    });
  }
};
