import Cart from "../models/cart.js";
import Product from "../models/Products.js";

export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId });

    res.json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, title, price, img, quantity, size } = req.body;

    let cart = await Cart.findOne({ user: userId });

    // Create a cart if not exist
    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: []
      });
    }

    // Check if the same product with same size already exists
    const existing = cart.items.find(
      (item) => item.productId === productId && item.size === size
    );

    if (existing) {
      existing.quantity += Number(quantity);
    } else {
      cart.items.push({
        productId,
        title,
        price,
        img,
        quantity,
        size
      });
    }

    await cart.save();
    res.json({ success: true, items: cart.items });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.id;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) return res.json({ items: [] });

    cart.items = cart.items.filter((i) => i.productId !== productId);
    await cart.save();

    res.json({ success: true, items: cart.items });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    await Cart.findOneAndUpdate(
      { user: userId },
      { items: [] }
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
