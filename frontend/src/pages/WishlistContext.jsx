// src/pages/WishlistContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const WishlistContext = createContext();
export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const BASE_URL = "http://localhost:5000/api";

  // 🔥 ALWAYS reads latest token
  const axiosInstance = axios.create({ baseURL: BASE_URL });
  axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  const normalizeItem = (item) => ({
    ...item,
    id: item?.id?.toString ? item.id.toString() : item._id?.toString ? item._id.toString() : item.id || item._id,
  });

  useEffect(() => {
    const fetchWishlist = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setWishlist([]);
        setLoading(false);
        return;
      }

      try {
        const res = await axiosInstance.get("/wishlist");
        setWishlist((res.data.items || []).map(normalizeItem));
      } catch (err) {
        console.error("Wishlist fetch error:", err.response?.data || err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  // ADD
  const addToWishlist = async (product) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Login required");

    console.log("❤️ addToWishlist received product:", product);
    console.log("   product.id:", product.id);
    console.log("   product._id:", product._id);

    const productId = product.id || product._id;
    if (!productId) {
      console.error("❌ Product ID missing in addToWishlist:", product);
      return alert("❌ Product ID missing");
    }

    console.log("✅ Extracted productId:", productId, "Type:", typeof productId);

    try {
      // Send ONLY productId to backend
      const payload = { productId: String(productId) };
      console.log("📤 Sending payload to /wishlist/add:", JSON.stringify(payload));

      const res = await axiosInstance.post("/wishlist/add", payload);
      console.log("📥 Response from /wishlist/add:", res.data);

      // Handle response structure
      const items = res.data.items || [];
      setWishlist(items.map(normalizeItem));
      console.log("✅ Wishlist updated with items:", items);
    } catch (err) {
      console.error("❌ Wishlist add error:", err.response?.data || err.message);
      alert("Failed to add to wishlist: " + (err.response?.data?.message || err.message));
    }
  };

  // REMOVE
  const removeFromWishlist = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Login required");

    try {
      const res = await axiosInstance.delete(`/wishlist/${id}`);
      setWishlist((res.data.items || []).map(normalizeItem));
    } catch (err) {
      console.error("Wishlist remove error:", err.response?.data || err);
    }
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, loading, addToWishlist, removeFromWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
