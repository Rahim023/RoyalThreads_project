import Cart from "../models/Cart.js";
import Product from "../models/Products.js";
import Signature from "../models/Signature.js";

/**
 * Helper: Format cart items for frontend
 */
const formatCartItems = (items) => {
  return items.map(item => ({
    id: String(item.id),
    title: item.title,
    price: item.price,
    img: item.img,
    quantity: item.quantity,
  }));
};

/**
 * POST /cart/add
 * Add product (normal or signature) to user's cart
 */
export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id;

    if (!productId) {
      return res.status(400).json({ success: false, message: "Product ID is required" });
    }

    // Try to find product in Product collection first
    let product = await Product.findById(productId);

    // If not found, check Signature collection
    if (!product) {
      product = await Signature.findById(productId);
    }

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Get or create user's cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Check if product is already in cart
    const existingIndex = cart.items.findIndex(item => String(item.id) === String(productId));

    if (existingIndex > -1) {
      // Increment quantity
      cart.items[existingIndex].quantity += 1;
    } else {
      // Add new item
      cart.items.push({
        id: String(product._id),
        title: product.title,
        price: product.price,
        img: product.img || product.images?.[0] || "", // fallback for Signature product
        quantity: 1,
      });
    }

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Product added to cart",
      items: formatCartItems(cart.items),
    });
  } catch (err) {
    console.error("❌ addToCart error:", err);
    res.status(500).json({ success: false, message: "Server error adding to cart", error: err.message });
  }
};

/**
 * GET /cart
 */
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    const items = cart ? formatCartItems(cart.items) : [];
    res.status(200).json({ success: true, items });
  } catch (err) {
    console.error("❌ getCart error:", err);
    res.status(500).json({ success: false, message: "Server error fetching cart", error: err.message });
  }
};

/**
 * DELETE /cart/:id
 */
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const productId = String(req.params.id);

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(200).json({ success: true, items: [] });

    cart.items = cart.items.filter(item => String(item.id) !== productId);
    await cart.save();

    res.status(200).json({ success: true, items: formatCartItems(cart.items) });
  } catch (err) {
    console.error("❌ removeFromCart error:", err);
    res.status(500).json({ success: false, message: "Server error removing from cart", error: err.message });
  }
};

/**
 * DELETE /cart/clear
 */
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.status(200).json({ success: true, message: "Cart cleared", items: [] });
  } catch (err) {
    console.error("❌ clearCart error:", err);
    res.status(500).json({ success: false, message: "Server error clearing cart", error: err.message });
  }
};
