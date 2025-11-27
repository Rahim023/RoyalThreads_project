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
export const getCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(200).json({ 
        success: true, 
        items: [] 
      });
    }

    // Return formatted items
    const formattedItems = formatCartItems(cart.items);
    res.status(200).json({ 
      success: true, 
      items: formattedItems 
    });
  } catch (err) {
    console.error("❌ getCart error:", err.message);
    res.status(500).json({ 
      success: false,
      message: "Server error fetching cart",
      error: err.message 
    });
  }
};

/**
 * DELETE /cart/:id
 * Removes a specific product from cart
 */
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const productId = String(req.params.id);

    console.log("🗑️ removeFromCart called for:", productId);

    if (!productId) {
      return res.status(400).json({ 
        success: false,
        message: "❌ Product ID is required in URL" 
      });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(200).json({ 
        success: true, 
        items: [] 
      });
    }

    // Filter out the item to remove (compare as strings)
    const beforeCount = cart.items.length;
    cart.items = cart.items.filter(item => String(item.id) !== productId);
    const afterCount = cart.items.length;

    if (beforeCount === afterCount) {
      console.log("⚠️ Product not found in cart");
    } else {
      console.log("✅ Product removed from cart");
    }

    await cart.save();

    // Return formatted items
    const formattedItems = formatCartItems(cart.items);
    res.status(200).json({ 
      success: true, 
      items: formattedItems 
    });
  } catch (err) {
    console.error("❌ removeFromCart error:", err.message);
    res.status(500).json({ 
      success: false,
      message: "Server error removing from cart",
      error: err.message 
    });
  }
};

/**
 * DELETE /cart/clear
 * Clears entire cart
 */
export const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId });
    if (cart) {
      cart.items = [];
      await cart.save();
      console.log("🗑️ Cart cleared");
    }

    res.status(200).json({ 
      success: true, 
      message: "✅ Cart cleared",
      items: [] 
    });
  } catch (err) {
    console.error("❌ clearCart error:", err.message);
    res.status(500).json({ 
      success: false,
      message: "Server error clearing cart",
      error: err.message 
    });
  }
};
