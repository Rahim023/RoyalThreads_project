import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import BlurText from "../components/BlurText";
import ShinyText from "../components/ShinyText";
import { useNavigate } from "react-router-dom";

export default function Men() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const BASE_URL = "http://localhost:5000/api";
  const navigate = useNavigate();

  // Fetch Men products from DB
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/products`);
        const menProducts = res.data.filter(
          (p) => p.category?.toLowerCase() === "men"
        );
        setProducts(menProducts);
        setFilteredProducts(menProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  // Filter products
  const applyFilter = (query, category) => {
    let filtered = products.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        (p.description && p.description.toLowerCase().includes(query))
    );
    if (category !== "All") filtered = filtered.filter((p) => p[category]);
    setFilteredProducts(filtered);
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    applyFilter(query, categoryFilter);
  };

  const handleCategoryClick = (category) => {
    setCategoryFilter(category);
    applyFilter(searchQuery, category);
  };

  const trendingProducts = products.filter((p) => p.trending);

  return (
    <div className="min-h-screen font-sansTrend bg-brand-mist">
      <Header />

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center px-6 md:px-20 py-16 gap-8">
        <div className="md:flex-1 flex justify-center">
          <motion.img
            src="https://amzn-s3-cap-bucket.s3.us-east-2.amazonaws.com/men_homepage/men_hero.jpg"
            alt="Men Hero"
            className="rounded-xl2 shadow-luxe w-full md:w-auto max-w-lg"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.2 }}
          />
        </div>
        <div className="md:flex-1 flex flex-col justify-center text-center md:text-left">
          <BlurText
            text="Royal Men’s Collection"
            animateBy="words"
            direction="top"
            delay={100}
            className="text-5xl md:text-6xl font-serifFancy font-bold text-brand-navy mb-4"
          />
          <ShinyText
            text="Premium styles for modern men."
            speed={5}
            className="text-lg md:text-xl text-gray-700 mb-6"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 rounded-2xl bg-brand-gold text-brand-navy font-semibold hover:bg-brand-ivory hover:text-brand-navy transition"
            onClick={() => window.scrollTo({ top: 500, behavior: "smooth" })}
          >
            Explore Now
          </motion.button>
        </div>
      </section>

      {/* Trending Now Section - Infinite Scroll */}
      {trendingProducts.length > 0 && (
        <section className="py-16 px-6 md:px-20">
          <h2 className="text-3xl md:text-4xl font-serifFancy font-bold text-brand-navy mb-8 text-center">
            Trending Now
          </h2>

          <div className=" relative">
            <div
              className="flex gap-6 animate-scroll whitespace-nowrap"
              style={{ animation: "scroll 8s linear infinite" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.animationPlayState = "paused")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.animationPlayState = "running")
              }
            >
              {[...trendingProducts, ...trendingProducts].map((p, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl2 min-w-[250px] flex-shrink-0 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-[0_0_60px_15px_rgba(128,0,0,0.6)]"
                  onClick={() => navigate(`/product/${p._id}`, { state: { product: p } })}
                >
                  <img
                    src={p.img}
                    alt={p.title}
                    className="w-full h-64 object-cover rounded-t-xl2"
                  />
                  <div className="p-4 text-center">
                    <h3 className="font-semibold">{p.title}</h3>
                    <p className="text-brand-gold font-bold mt-2">${p.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Search + Product Grid */}
      <section className="px-6 md:px-20 py-16">
        <div className="flex flex-col md:flex-row md:justify-between items-center mb-8 gap-4">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearch}
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-navy w-full md:w-1/3"
          />
          <div className="flex flex-wrap gap-3">
            {["All", "Jackets", "Shirts", "T-Shirts", "Jeans"].map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`px-4 py-2 rounded-full font-semibold border transition ${
                  categoryFilter === cat
                    ? "bg-brand-navy text-brand-ivory border-brand-navy"
                    : "border-gray-300 text-gray-700 hover:bg-brand-mist"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map((p) => (
            <motion.div
              key={p._id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ProductCard product={p} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-navy text-brand-ivory py-8 text-center">
        <p className="text-sm">© 2025 MyClothing. All rights reserved.</p>
      </footer>

      {/* Add CSS for scrolling */}
      <style>
        {`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}
      </style>
    </div>
  );
}
