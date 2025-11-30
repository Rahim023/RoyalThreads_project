// src/pages/Wishlist.jsx
import React from "react";
import Header from "../components/Header";
import { useWishlist } from "./WishlistContext";
import { motion } from "framer-motion";
import { Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCurrency } from "../context/CurrencyContext";

export default function Wishlist() {
  const { wishlist, loading, removeFromWishlist } = useWishlist();
  const { currencySymbol, convertPrice } = useCurrency();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-mist">
        <Header />
        <div className="flex justify-center items-center text-xl py-40 text-brand-charcoal">
          Loading wishlist...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-mist flex flex-col">
      <Header />

      {/* HERO */}
      <div className="bg-white py-16 text-center border-b border-gray-200">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-serifFancy text-brand-navy tracking-wide"
        >
          Your Wishlist
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-brand-charcoal/80 mt-3 text-lg"
        >
          Save the items you love ❤️
        </motion.p>
      </div>

      {/* EMPTY */}
      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-brand-charcoal">
          <p className="text-xl">Your wishlist is empty.</p>
        </div>
      ) : (
        <div className="px-6 md:px-20 py-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {wishlist.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              whileHover={{
                scale: 1.04,
                boxShadow: "0px 15px 40px rgba(0,0,0,0.15)",
              }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:border-brand-gold transition-all"
            >
              {/* IMAGE */}
              <div className="relative group">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-64 object-cover"
                />

                {/* REMOVE */}
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="absolute top-3 right-3 bg-white/90 backdrop-blur-lg p-2 rounded-full shadow text-red-600 hover:bg-red-600 hover:text-white transition"
                >
                  <Trash2 size={18} />
                </button>

                {/* VIEW */}
                <button
                  onClick={() => navigate(`/product/${item.id}`)}
                  className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 
                  bg-brand-navy text-brand-ivory px-4 py-2 rounded-full shadow transition-all duration-300 
                  hover:bg-brand-gold hover:text-brand-navy flex items-center gap-2"
                >
                  <Eye size={16} /> View Product
                </button>
              </div>

              {/* DETAILS */}
              <div className="p-5 text-center">
                <h3 className="text-xl font-semibold text-brand-navy">
                  {item.title}
                </h3>

                <p className="mt-2 text-brand-gold font-bold text-lg tracking-wide">
                  {currencySymbol}
                  {convertPrice(item.price)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <footer className="bg-brand-navy text-brand-ivory py-6 text-center mt-auto">
        © 2025 Royal Threads • All rights reserved
      </footer>
    </div>
  );
}
  