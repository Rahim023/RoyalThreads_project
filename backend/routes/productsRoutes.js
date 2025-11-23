import express from "express";
import { getAllProducts, getTrendingProducts } from "../controllers/productController.js";

const router = express.Router();

// GET all products with optional boolean query filters
router.get("/", getAllProducts);

// GET trending products
router.get("/trending", getTrendingProducts);

export default router;
