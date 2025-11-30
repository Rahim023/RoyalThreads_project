import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  addToCart,
  getCart,
  removeFromCart,
  clearCart
} from "../controllers/cartController.js";

import {
  createOrder,
  getOrder,
  cancelOrder,
  deleteOrder
} from "../controllers/orderController.js";

const router = express.Router();

// CART ROUTES
router.get("/cart", protect, getCart);
router.post("/cart/add", protect, addToCart);
router.delete("/cart/:id", protect, removeFromCart);
router.delete("/cart/clear", protect, clearCart);

// ORDER ROUTES
router.post("/orders", protect, createOrder);
router.get("/orders/:id", protect, getOrder);
router.put("/orders/cancel/:id", protect, cancelOrder);
router.delete("/orders/delete/:id", protect, deleteOrder);

export default router;
