// ⭐⭐⭐ FINAL CART CONTROLLER (paste into controllers/cartController.js)
import Cart from "../models/cart.js";

export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    let cart = await Cart.findOne({ user: userId });
    if (!cart) return res.json({ items: [] });

    // Return a consistent shape: { items: [...] }
    return res.json({ items: cart.items });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, title, price, img, quantity, size } = req.body;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: []
      });
    }

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
    const { size } = req.query; // optional size to remove specific item

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.json({ items: [] });

    // If size provided, remove only the matching productId+size
    if (size) {
      cart.items = cart.items.filter(
        (i) => !(i.productId === productId && String(i.size) === String(size))
      );
    } else {
      // Fallback: remove items matching productId
      cart.items = cart.items.filter((i) => i.productId !== productId);
    }

    await cart.save();
    return res.json({ success: true, items: cart.items });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    await Cart.findOneAndUpdate({ user: userId }, { items: [] });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
