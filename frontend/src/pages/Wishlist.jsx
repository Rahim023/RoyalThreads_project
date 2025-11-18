// src/pages/Wishlist.jsx
import React from "react";
import Header from "../components/Header";
import { useWishlist } from "./WishlistContext";
import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";

export default function Wishlist() {
  const { wishlist, loading, removeFromWishlist } = useWishlist();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-brand-mist">
        <Header />
        <div className="text-center py-40 text-xl text-brand-charcoal">
          Loading your wishlist...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-brand-mist">
      <Header />

      {/* ⭐ Hero Section */}
      <section className="relative pt-20 pb-28 px-6 md:px-20 bg-gradient-to-b from-brand-navy to-brand-mist">
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,white,transparent_70%)]"></div>
        <div className="relative z-10 text-center">
          <div className="flex justify-center mb-4">
            <Sparkles className="text-brand-gold w-10 h-10 animate-pulse" />
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-extrabold text-brand-ivory tracking-wide drop-shadow-lg">
            My Wishlist
          </h1>
          <p className="text-brand-ivory/90 mt-4 text-lg md:text-xl font-light max-w-2xl mx-auto">
            Your curated list of favorites — beautifully saved for later ❤️
          </p>
          <div className="mt-10 flex justify-center">
            <div className="w-24 h-1 bg-brand-gold rounded-full shadow"></div>
          </div>
        </div>
      </section>

      {/* ⭐ Wishlist Content */}
      <section className="py-16 px-6 md:px-20 flex-1">
        {wishlist.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-14 h-14 mx-auto text-brand-navy mb-4 opacity-60" />
            <p className="text-xl text-brand-charcoal">
              Your wishlist is empty. Add products by clicking on the heart ❤️
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
            {wishlist.map((item) => {
              const id = item.id || item._id; // normalize ID
              return (
                <motion.div
                  key={id}
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="bg-white rounded-2xl shadow-xl border border-brand-ivory/60 overflow-hidden hover:shadow-2xl transition-all"
                >
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-64 object-cover rounded-t-2xl hover:scale-105 transition-transform"
                  />

                  <div className="p-5 text-center">
                    <h3 className="font-serif text-xl font-semibold text-brand-navy">
                      {item.title}
                    </h3>

                    <p className="text-brand-gold text-xl mt-2 font-bold tracking-wide">
                      ₹{item.price}
                    </p>

                    <button
                      onClick={() => removeFromWishlist(id)}
                      className="mt-5 px-4 py-2 rounded-xl border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 shadow-sm cursor-pointer"
                    >
                      Remove ❌
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-brand-navy text-brand-ivory py-8 text-center">
        <p className="text-sm">&copy; 2025 MyClothing. All rights reserved.</p>
      </footer>
    </div>
  );
}
