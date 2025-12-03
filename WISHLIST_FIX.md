# Signature Product Wishlist Fix

## Problem
When adding a Signature product to the wishlist from the SignatureProductPage, an error occurred: "Product not found in database".

## Root Cause
The wishlist controller (`wishlistController.js`) was only searching for products in the `Product` collection. However, Signature products are stored in a separate `Signature` collection, so they couldn't be found.

## Solution
Updated `backend/controllers/wishlistController.js` to:

1. **Import Signature model**:
   ```javascript
   import Signature from "../models/Signature.js";
   ```

2. **Search both collections in `addToWishlist` function**:
   - First search in Product collection
   - If not found, search in Signature collection
   - Only return error if product not found in EITHER collection

## Changes Made

### File: `backend/controllers/wishlistController.js`

**Line 2** - Added import:
```javascript
import Signature from "../models/Signature.js";
```

**Lines 74-87** - Updated product lookup logic:
```javascript
// Find product by string _id - check BOTH Product and Signature collections
let product = await Product.collection.findOne({ _id: String(productId) });

if (!product) {
  // Try Signature collection if not found in Product
  product = await Signature.collection.findOne({ _id: String(productId) });
}

if (!product) {
  console.error("❌ [addToWishlist] Product not found in Product or Signature collection for ID:", productId);
  return res.status(404).json({ 
    success: false,
    message: "❌ Product not found in database" 
  });
}
```

## Result
✅ Users can now successfully add Signature products to their wishlist
✅ The same API endpoint handles both regular Products and Signature products
✅ Error messages now clearly indicate if product is not found in either collection

## Testing
To verify the fix:
1. Go to a Signature product page (e.g., http://localhost:5176/signature/...)
2. Click "Add to Wishlist"
3. Should see popup "Item added to wishlist" (no error)
4. Check your wishlist page to see the product listed
