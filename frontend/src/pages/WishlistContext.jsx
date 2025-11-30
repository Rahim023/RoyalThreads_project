// src/pages/WishlistContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const WishlistContext = createContext();
export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const axiosInstance = axios.create({
    baseURL: "http://localhost:5000/api",
  });

  axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  // 🔹 Resolve ID from ANY shape
  const resolveId = (item) => {
    if (!item) return null;

    if (item.productId) return String(item.productId);
    if (item._id) return String(item._id);
    if (item.id) return String(item.id);
    if (item.product && (item.product._id || item.product.id)) {
      return String(item.product._id || item.product.id);
    }
    return null;
  };

  // 🔹 Normalize wishlist item
  const normalize = (item) => {
    const prod = item.product || item;
    const id = resolveId(item) || resolveId(prod) || "unknown";

    return {
      id,
      title: prod.title || item.title || "Untitled Product",
      img: prod.img || item.img || prod.images?.[0] || "",
      price: prod.price || item.price || 0,
      size: item.size,
      ...item,
    };
  };

  // 🔹 Load wishlist on mount
  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setWishlist([]);
        setLoading(false);
        return;
      }

      try {
        const res = await axiosInstance.get("/wishlist");
        setWishlist((res.data.items || []).map(normalize));
      } catch (err) {
        console.error("Wishlist fetch error:", err.response?.data || err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // 🔹 Add product
  const addToWishlist = async (product) => {
    const productId = resolveId(product);

    if (!productId) {
      console.error("❌ Product ID missing in addToWishlist:", product);
      return alert("Product ID missing");
    }

    try {
      const res = await axiosInstance.post("/wishlist/add", {
        productId: String(productId),
      });

      setWishlist((res.data.items || []).map(normalize));
    } catch (err) {
      console.error("Wishlist add error:", err.response?.data || err);
      alert(
        "Failed to add: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  // 🔹 Remove product
  const removeFromWishlist = async (id) => {
    try {
      const res = await axiosInstance.delete(`/wishlist/${String(id)}`);
      setWishlist((res.data.items || []).map(normalize));
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
