import express from "express";
import auth from "../middleware/authMiddleware.js";
import {
  createOrder,
  getOrder,
  cancelOrder,
  deleteOrder,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/", auth, createOrder);
router.get("/:id", auth, getOrder);
router.put("/cancel/:id", auth, cancelOrder);
router.delete("/:id", auth, deleteOrder);

export default router;
