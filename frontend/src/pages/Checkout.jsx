// src/pages/Checkout.jsx
import React from "react";
import Header from "../components/Header";
import { useCart } from "./CartContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Trash2, ShoppingCart, Lock, CheckCircle } from "lucide-react";
import { useCurrency } from "../context/CurrencyContext";

export default function Checkout() {
  const { cart, clearCart, removeFromCart } = useCart();
  const navigate = useNavigate();
  const { convertPrice, country } = useCurrency();

  const currencySymbol =
    country === "Canada" ? "CA$" :
    country === "USA" ? "US$" :
    "₹";

  const totalConverted = cart
    .reduce(
      (sum, item) =>
        sum + Number(convertPrice(item.price)) * Number(item.quantity),
      0
    )
    .toFixed(2);

  // ⭐ PLACE ORDER (Backend Working)
  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;

    const totalINR = cart.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0
    );

    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        items: cart.map((i) => ({
          productId: String(i.id),
          title: i.title,
          price: Number(i.price),
          quantity: Number(i.quantity),
          size: i.size,
          img: i.img,
        })),
        totalINR,
      }),
    });

    const data = await res.json();

    localStorage.setItem("lastOrderId", data.order._id);

    clearCart();
    navigate(`/payment/${data.order._id}`);
  };

  return (
    <div className="min-h-screen bg-brand-mist font-sansTrend">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-brand-navy via-brand-purple to-brand-charcoal py-16 text-center border-b-4 border-brand-gold">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-3 mb-4"
        >
          <Lock size={40} className="text-brand-gold" />
          <h1 className="text-4xl md:text-5xl font-serifFancy font-bold text-brand-ivory">
            Secure Checkout
          </h1>
        </motion.div>
        <p className="text-brand-gold/80 text-lg mt-2">Review your order before placing</p>
      </div>

      <section className="py-16 px-6 md:px-20">
        {cart.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingCart size={80} className="mx-auto text-brand-gold/40 mb-6" />
            <p className="text-2xl font-semibold text-brand-navy">
              Your cart is empty
            </p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {/* Order Summary Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white shadow-xl border-2 border-brand-gold rounded-3xl p-10 mb-8"
            >
              {/* SUMMARY HEADER */}
              <div className="flex items-center gap-3 mb-8 pb-6 border-b-2 border-brand-gold/30">
                <CheckCircle size={32} className="text-brand-gold" />
                <h2 className="text-3xl font-serifFancy font-bold text-brand-navy">
                  Order Summary
                </h2>
              </div>

              {/* PRODUCT LIST */}
              <div className="space-y-4 mb-8">
                {cart.map((item, idx) => (
                  <motion.div
                    key={`${item.id}-${item.size}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex justify-between items-center bg-gradient-to-r from-brand-ivory to-brand-mist border border-brand-gold/20 p-6 rounded-2xl hover:border-brand-gold transition-all"
                  >
                    {/* LEFT SIDE */}
                    <div className="flex-1">
                      <p className="text-lg font-semibold text-brand-navy font-serifFancy">
                        {item.title}
                      </p>
                      <div className="flex gap-6 mt-2 text-sm text-brand-charcoal">
                        <p>Size: <span className="font-bold text-brand-gold">{item.size}</span></p>
                        <p>Qty: <span className="font-bold text-brand-gold">{item.quantity}</span></p>
                      </div>
                    </div>

                    {/* PRICE */}
                    <div className="text-right mx-6">
                      <p className="text-lg font-bold text-brand-gold">
                        {currencySymbol} {(convertPrice(item.price) * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-xs text-brand-charcoal/70">{currencySymbol} {convertPrice(item.price)} each</p>
                    </div>

                    {/* DELETE BUTTON */}
                    <button
                      onClick={() => removeFromCart(item.id, item.size)}
                      className="p-3 bg-red-100 text-red-600 rounded-full hover:bg-red-600 hover:text-white transition-all duration-300"
                    >
                      <Trash2 size={20} />
                    </button>
                  </motion.div>
                ))}
              </div>

              {/* TOTAL PRICE */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-brand-navy to-brand-purple p-6 rounded-2xl text-brand-ivory"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="text-lg">Subtotal:</span>
                  <span className="text-lg font-bold text-brand-gold">{currencySymbol} {totalConverted}</span>
                </div>
                <div className="border-t border-brand-gold/30 pt-3 flex justify-between items-center">
                  <h3 className="text-2xl font-bold font-serifFancy">Total:</h3>
                  <span className="text-3xl font-bold text-brand-gold">
                    {currencySymbol} {totalConverted}
                  </span>
                </div>
              </motion.div>
            </motion.div>

            {/* BUTTONS */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row justify-between gap-4"
            >
              <button
                onClick={clearCart}
                className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg font-bold transition-all duration-300"
              >
                Clear Cart
              </button>

              <button
                onClick={handlePlaceOrder}
                className="px-8 py-3 bg-gradient-to-r from-brand-gold to-brand-gold text-brand-navy hover:shadow-lg hover:shadow-brand-gold/50 rounded-full font-bold transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                <Lock size={20} className="group-hover:rotate-12 transition-transform" />
                Proceed to Payment
              </button>
            </motion.div>
          </div>
        )}
      </section>

      <footer className="bg-brand-navy text-brand-ivory py-6 text-center mt-20">
        <p className="text-sm">© 2025 RoyalThreads. All rights reserved.</p>
      </footer>
    </div>
  );
}
