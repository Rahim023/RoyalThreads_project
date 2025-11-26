import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Header from "../components/Header";
import { useCart } from "../pages/CartContext";   // ✅ Cart Context
import { useWishlist } from "../pages/WishlistContext"; // ✅ Wishlist Context
import { FaHeart } from "react-icons/fa"; // ✅ Heart Icon

export default function Wedding() {
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  const [weddingProducts, setWeddingProducts] = useState([]);
  const [currentHero, setCurrentHero] = useState(0);

  const BASE_URL = "http://localhost:5000/api";

  // 🔹 FIXED AWS HERO IMAGES (2–3 slides like Men.jsx)
  const heroImages = [
    "https://amzn-s3-cap-bucket.s3.us-east-2.amazonaws.com/wedding+homepage/wedding_1.jpg",
    "https://amzn-s3-cap-bucket.s3.us-east-2.amazonaws.com/wedding+homepage/wedding_2.webp",
    "https://amzn-s3-cap-bucket.s3.us-east-2.amazonaws.com/wedding+homepage/wedding_3.jpg",
  ];

  // 🔹 Hero slideshow (same behaviour as Men page)
  useEffect(() => {
    if (!heroImages.length) return;
    const interval = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  // 🔹 Fetch Wedding products from backend
  useEffect(() => {
    const fetchWedding = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/products`);
        const weddingItems = res.data.filter((p) => p.Wedding === true);
        setWeddingProducts(weddingItems);
      } catch (err) {
        console.error("Error fetching wedding products:", err);
      }
    };
    fetchWedding();
  }, []);

  // 🔹 Normalize product for cart / wishlist
  const makeCartItem = (p) => ({
    id: p._id,
    title: p.title || p.name,
    price: p.price,
    img: p.img || p.image,
  });

  return (
    <div className="min-h-screen flex flex-col bg-brand-mist font-sansTrend">
      {/* 🔹 Global Header */}
      <Header />

      {/* 🔹 Hero Section (AWS slideshow) */}
      <section className="relative w-full h-[60vh] md:h-[75vh] overflow-hidden">
        {heroImages.map((img, idx) => (
          <motion.img
            key={idx}
            src={img}
            initial={{ opacity: 0 }}
            animate={{ opacity: currentHero === idx ? 1 : 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ))}

        {/* 🔹 Show text ONLY from 2nd slide onwards */}
        {currentHero !== 0 && (
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-4">
            <motion.h1
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.2 }}
              className="text-white text-4xl md:text-6xl font-bold mb-4"
            >
              Timeless Wedding Collection
            </motion.h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
              Royal bridal lehengas, sarees and gowns crafted for unforgettable
              celebrations.
            </p>
          </div>
        )}
      </section>

      {/* 🔹 Product Grid */}
      <section className="px-6 md:px-20 py-16 bg-brand-mist flex-1">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-brand-navy mb-10">
          Wedding Collection
        </h2>

        {weddingProducts.length === 0 ? (
          <p className="text-center text-brand-charcoal/80">
            Loading wedding outfits...
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {weddingProducts.map((item) => {
              const img = item.img || item.image;
              const title = item.title || item.name;
              return (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl shadow-luxe overflow-hidden hover:scale-105 transition-transform duration-300"
                >
                  {/* Product Image */}
                  <img
                    src={img}
                    alt={title}
                    className="w-full h-64 object-cover"
                  />

                  {/* Product Info */}
                  <div className="p-4 text-center">
                    <h3 className="font-semibold text-lg">{title}</h3>
                    <p className="text-brand-gold font-bold mt-2">
                      ₹{item.price}
                    </p>

                    {/* ✅ Buttons Row */}
                    <div className="flex justify-center gap-3 mt-4">
                      {/* 🛒 Add to Cart */}
                      <button
                        onClick={() => addToCart(makeCartItem(item))}
                        className="flex-1 py-2 px-4 rounded-lg bg-brand-navy text-white hover:bg-brand-gold hover:text-brand-charcoal transition-colors"
                      >
                        Add to Cart
                      </button>

                      {/* ❤️ Add to Wishlist */}
                      <button
                        onClick={() => addToWishlist(makeCartItem(item))}
                        className="px-4 py-2 rounded-lg border border-brand-gold text-brand-navy hover:bg-brand-gold hover:text-white transition-colors"
                      >
                        <FaHeart />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 🔹 Footer */}
      <footer className="bg-brand-navy text-brand-ivory py-8 text-center">
        <p className="text-sm">© 2025 MyClothing. All rights reserved.</p>
      </footer>
    </div>
  );
}
