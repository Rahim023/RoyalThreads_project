// src/pages/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const BASE_URL = "http://localhost:5000/api";

  // 🔥 Axios instance that ALWAYS fetches latest token
  const axiosInstance = axios.create({ baseURL: BASE_URL });
  axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  const normalizeItem = (item) => ({
    ...item,
    id: item.id || item._id,
  });

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem("token");
      if (!token) return setCart([]);

      try {
        const res = await axiosInstance.get("/cart");
        setCart((res.data.items || []).map(normalizeItem));
      } catch (err) {
        console.error("Cart fetch error:", err.response?.data || err);
      }
    };

    fetchCart();
  }, []);

  // ADD TO CART
  const addToCart = async (product) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Login required");

    const productId = product.id || product._id;
    if (!productId) return alert("❌ Product ID missing");

    try {
      const payload = { productId, quantity: 1 };
      const res = await axiosInstance.post("/cart/add", payload);

      setCart((res.data.items || []).map(normalizeItem));
    } catch (err) {
      console.error("Add to cart failed:", err.response?.data || err);
    }
  };

  // REMOVE
  const removeFromCart = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Login required");

    try {
      const res = await axiosInstance.delete(`/cart/${id}`);
      setCart((res.data.items || []).map(normalizeItem));
    } catch (err) {
      console.error("Remove error:", err.response?.data || err);
    }
  };

  // CLEAR
  const clearCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Login required");

    try {
      await axiosInstance.delete("/cart/clear");
      setCart([]);
    } catch (err) {
      console.error("Clear error:", err.response?.data || err);
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
