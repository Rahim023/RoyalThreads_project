import Cart from "../models/Cart.js";

// Add to cart
export const addToCart = async (req, res) => {
  try {
    const { id, title, price, img } = req.body;
    const userId = req.user.id;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) cart = new Cart({ user: userId, items: [] });

    const existingItem = cart.items.find(item => item.id.toString() === id);
    if (existingItem) existingItem.quantity += 1;
    else cart.items.push({ id, title, price, img, quantity: 1 });

    await cart.save();
    res.json(cart.items); // only send items array
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get cart
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ user: userId });
    res.json(cart?.items || []);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Remove item
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const id = req.params.id;
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.json([]);

    cart.items = cart.items.filter(item => item.id.toString() !== id);
    await cart.save();
    res.json(cart.items);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Clear cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ user: userId });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json([]);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};
