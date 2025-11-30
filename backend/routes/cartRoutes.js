import express from "express";
import { addToCart, getCart, removeFromCart, clearCart } from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Save item to MongoDB
router.post("/add", protect, addToCart);

// Get user’s cart
router.get("/", protect, getCart);

// Clear cart (put before :id to avoid route conflict)
router.delete("/clear", protect, clearCart);

// Remove single item
router.delete("/:id", protect, removeFromCart);


export default router;
