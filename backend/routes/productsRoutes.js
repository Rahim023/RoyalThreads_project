import express from "express";
import {
  getAllProducts,
  getTrendingProducts,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/trending", getTrendingProducts);

export default router;
