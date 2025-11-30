// src/pages/WishlistContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const WishlistContext = createContext();
export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const BASE_URL = "http://localhost:5000/api";

  // Axios with token
  const axiosInstance = axios.create({ baseURL: BASE_URL });
  axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  // ⭐ Normalize FULL product details
  const normalizeItem = (item) => {
    const id =
      item?.id?.toString?.() ||
      item?._id?.toString?.() ||
      item.id ||
      item._id;

    return {
      id,
      title: item.title || "Untitled Product",
      img: item.img || item.images?.[0] || "",
      price: item.price || 0,
      description: item.description || "",
      rating: item.rating || 4,
      stock: item.stock || 10,
      brand: item.brand || "Royal Threads",
      ...item,
    };
  };

  // ⭐ Fetch wishlist on load
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
        const items = res.data.items || [];
        setWishlist(items.map((p) => normalizeItem(p)));
      } catch (err) {
        console.error("Wishlist fetch error:", err.response?.data || err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  // ⭐ Add product
  const addToWishlist = async (product) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Login required");

    const productId = product.id || product._id;
    if (!productId) return alert("Product ID missing");

    try {
      const res = await axiosInstance.post("/wishlist/add", {
        productId: String(productId),
      });

      const items = res.data.items || [];
      setWishlist(items.map((p) => normalizeItem(p)));
    } catch (err) {
      console.error("Wishlist add error:", err.response?.data || err);
      alert(
        "Failed to add: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  // ⭐ Remove product
  const removeFromWishlist = async (id) => {
    try {
      const res = await axiosInstance.delete(`/wishlist/${id}`);
      const items = res.data.items || [];
      setWishlist(items.map((p) => normalizeItem(p)));
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
