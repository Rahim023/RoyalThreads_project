<<<<<<< HEAD
// ⭐⭐⭐ FINAL CART CONTROLLER (paste into controllers/cartController.js)
import Cart from "../models/cart.js";

=======
import Cart from "../models/Cart.js";
import Product from "../models/Products.js";
import Signature from "../models/Signature.js";

/**
 * Helper: Format cart items for frontend
 */
const formatCartItems = (items) => {
  return items.map(item => {
    const id = item.id ? (typeof item.id === 'string' ? item.id : item.id.toString()) : String(item._id || '');
    return {
      id: id,
      title: item.title,
      price: item.price,
      img: item.img,
      quantity: item.quantity,
    };
  });
};

/**
 * POST /cart/add
 * Body: { productId }
 * Fetches product from DB, adds/updates in cart, returns full cart
 */
export const addToCart = async (req, res) => {
  try {
    console.log("🛒 [addToCart] Called");
    console.log("   req.body:", JSON.stringify(req.body));
    console.log("   req.body.productId:", req.body.productId);
    console.log("   req.user._id:", req.user._id);

    const { productId } = req.body;
    const userId = req.user._id;

    console.log("🛒 Extracted productId:", productId, "Type:", typeof productId);

    if (!productId) {
      console.error("❌ [addToCart] No productId in request body. Body was:", req.body);
      return res.status(400).json({ 
        success: false,
        message: "❌ productId is required in request body" 
      });
    }

    // Find product by string _id using native query to avoid ObjectId casting
    let product = await Product.collection.findOne({ _id: String(productId) });
    let source = "products";

    // If not found in products, try signatures collection (signature series items)
    if (!product) {
      product = await Signature.collection.findOne({ _id: String(productId) });
      source = "signatures";
    }

    if (!product) {
      console.error("❌ [addToCart] Product not found for ID:", productId);
      return res.status(404).json({ 
        success: false,
        message: "❌ Product not found in database" 
      });
    }

    console.log(`✅ [addToCart] Product found in ${source} collection:`, product.title || product.title);

    // Get or create user's cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
      console.log("📦 [addToCart] Created new cart for user");
    }

    // Check if product already in cart (compare as strings)
    const existingItemIndex = cart.items.findIndex(
      item => String(item.id) === String(productId)
    );

    if (existingItemIndex > -1) {
      // Product exists, increment quantity
      cart.items[existingItemIndex].quantity += 1;
      console.log("📦 [addToCart] Increased quantity for:", product.title);
    } else {
      // Add new product to cart with string _id
      const newProductId = String(product._id);
      // signature items may store images in `images` array; products may have `img`
      const image = product.img || product.image || (product.images && product.images[0]) || '';
      cart.items.push({
        id: newProductId,
        title: product.title,
        price: product.price,
        img: image,
        quantity: 1,
      });
      console.log("✅ [addToCart] Added product to cart:", product.title);
    }

    await cart.save();
    console.log("💾 [addToCart] Cart saved");

    // Return formatted cart items
    const formattedItems = formatCartItems(cart.items);
    res.status(200).json({ 
      success: true, 
      message: "✅ Product added to cart",
      items: formattedItems 
    });
  } catch (err) {
    console.error("❌ [addToCart] Error:", err.message);
    res.status(500).json({ 
      success: false,
      message: "Server error adding to cart",
      error: err.message 
    });
  }
};

/**
 * GET /cart
 * Returns user's current cart items
 */
>>>>>>> 07afdce (fix(cart): accept signature products in addToCart)
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
