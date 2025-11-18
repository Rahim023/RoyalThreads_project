import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import FeaturedCollection from "./FeaturedCollection";

export default function Women() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentHero, setCurrentHero] = useState(0);

  const BASE_URL = "http://localhost:5000/api";

  // Hero images
  const heroImages = [
    "/women1.jpg",
    "/women2.jpg",
    "/women3.jpg",
  ];

  // Auto-change hero image every 4 sec
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Fetch products (only women category)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/products`);
        const womenProducts = res.data.filter(
          (p) => p.category?.toLowerCase() === "women"
        );
        setProducts(womenProducts);
        setFilteredProducts(womenProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  // Handle search
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = products.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        (p.description && p.description.toLowerCase().includes(query))
    );
    setFilteredProducts(filtered);
  };

  return (
    <div className="min-h-screen bg-brand-mist">

      {/* Global Header */}
      <Header />

      {/* Hero Section */}
      <div className="relative w-full h-[60vh] md:h-[75vh] overflow-hidden">
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

        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <motion.h1
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-white text-4xl md:text-6xl font-serifFancy font-bold text-center"
          >
            Women’s Fashion Collection
          </motion.h1>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-6 md:px-20 py-8 flex justify-center">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full max-w-lg p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-navy transition"
        />
      </div>

      {/* Featured Collection */}
      <FeaturedCollection products={products.slice(0, 6)} />

      {/* Explore All Products */}
      <section className="py-12 px-6 md:px-20">
        <h2 className="text-3xl md:text-4xl font-serifFancy font-bold text-brand-navy text-center mb-10">
          Explore All Products
        </h2>

        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
        >
          {filteredProducts.slice(0, 16).map((product) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Subscription Section */}
      <section className="bg-brand-navy text-brand-ivory py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-serifFancy font-bold mb-4">
          Subscribe to Our Newsletter
        </h2>
        <p className="text-lg mb-6">
          Get the latest updates and exclusive offers.
        </p>
        <form className="flex justify-center gap-3 flex-wrap">
          <input
            type="email"
            placeholder="Enter your email"
            className="p-3 rounded-lg w-64 max-w-full focus:outline-none focus:ring-2 focus:ring-brand-gold"
          />
          <button className="px-6 py-3 rounded-lg bg-brand-gold text-brand-navy font-semibold hover:bg-brand-ivory hover:text-brand-navy transition">
            Subscribe
          </button>
        </form>
      </section>

      {/* Footer */}
      <footer className="bg-brand-navy text-brand-ivory py-6 text-center mt-12">
        <p>© 2025 MyClothing. All rights reserved.</p>
      </footer>
    </div>
  );
}
