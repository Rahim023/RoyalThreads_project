import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import collectionRoutes from "./routes/collectionRoutes.js";
import productRoutes from "./routes/productsRoutes.js";
import SignatureRoutes from "./routes/SignatureRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import { protect } from "./middleware/authMiddleware.js";
import shopRoutes from "./routes/shopRoutes.js";

dotenv.config();
const app = express();

// ✅ CORS configuration for Netlify + localhost
app.use(cors({
  origin: [
    'http://localhost:5174',
    'http://localhost:3000',
    process.env.FRONTEND_URL || 'https://royal-threads.netlify.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// ✅ Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "✅ Backend is running", 
    env: process.env.NODE_ENV || "development",
    mongoConnected: mongoose.connection.readyState === 1
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/shop", shopRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/wishlist", wishlistRoutes); 
app.use("/api/collections", collectionRoutes);
app.use("/api/products", productRoutes);
app.use("/api/signatures", SignatureRoutes);
app.use("/api/orders", orderRoutes);

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => console.error("❌ DB Error:", err));

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is in use, retrying in 5 seconds...`);
    setTimeout(() => {
      server.close();
      app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
    }, 5000);
  }
});
