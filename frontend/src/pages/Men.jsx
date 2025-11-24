import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Header from "../components/Header";
import ProductCardMen from "../components/ProductCardMen";
import BlurText from "../components/BlurText";
import ShinyText from "../components/ShinyText";
import { useNavigate } from "react-router-dom";

export default function Men() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [currentHero, setCurrentHero] = useState(0);
  const BASE_URL = "http://localhost:5000/api";
  const navigate = useNavigate();

  const heroImages = [
    "https://amzn-s3-cap-bucket.s3.us-east-2.amazonaws.com/men_homepage/men_hero.jpg",
    "https://amzn-s3-cap-bucket.s3.us-east-2.amazonaws.com/men_homepage/men_hero2.jpg",
    "https://amzn-s3-cap-bucket.s3.us-east-2.amazonaws.com/men_homepage/men_hero3.jpg",
  ];

  // Hero carousel animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Fetch Men products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/products`);
        const menProducts = res.data.filter((p) => p.Men === true);
        setProducts(menProducts);
        setFilteredProducts(menProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  // Apply search or category filter
  const applyFilter = (query = "", keyword = "") => {
    let filtered = products.filter(
      (p) =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(query.toLowerCase()))
    );

    if (keyword && keyword !== "All") {
      const lowerKeyword = keyword.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(lowerKeyword) ||
          (p.description && p.description.toLowerCase().includes(lowerKeyword))
      );
    }

    setFilteredProducts(filtered);
  };

  const handleSearch = (e) => {
    const query = e.target.value;
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
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-center px-4">
          <motion.h1
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2 }}
            className="text-white text-4xl md:text-6xl font-sansTrend font-bold mb-4"
          >
            Men’s Fashion Collection
          </motion.h1>
          <ShinyText
            text="Premium styles for modern men."
            speed={5}
            className="font-script text-lg md:text-xl text-gray-200 mb-6"
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
      </div>

      {/* Search + Category Filter */}
      <section className="px-6 md:px-20 py-12 flex flex-wrap justify-center gap-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleSearch}
          className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-navy w-full md:w-1/3 font-body"
        />
        <div className="flex flex-wrap gap-3">
          {["All", "Jacket", "Shirt", "T-Shirt", "Jeans"].map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`px-4 py-2 rounded-full font-semibold border transition ${
                categoryFilter === cat
                  ? "bg-brand-navy text-brand-ivory border-brand-navy"
                  : "border-gray-300 text-gray-700 hover:bg-brand-mist"
              } font-body`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Trending Section */}
      {trendingProducts.length > 0 && (
        <section className="py-8 px-6 md:px-20">
          <BlurText
            text="Trending Now"
            animateBy="words"
            direction="top"
            delay={100}
            className="text-5xl md:text-6xl font-fancy font-bold text-brand-navy mb-8 justify-center flex"
          />
          <div
            className="relative"
            onMouseEnter={(e) => {
              e.currentTarget.firstChild.style.animationPlayState = "paused";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.firstChild.style.animationPlayState = "running";
            }}
          >
            <div
              className="flex gap-6 whitespace-nowrap animate-scroll"
              style={{ animation: "scroll 12s linear infinite" }}
            >
              {[...trendingProducts, ...trendingProducts].map((p, i) => (
                <div key={i} className="min-w-[250px] flex-shrink-0">
                  <ProductCardMen product={p} minimal={true} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Products Grid */}
      <section className="py-16 px-6 md:px-20">
        <h2 className="text-5xl font-sansTrend font-bold text-brand-navy mb-10 text-center">
          Explore All Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {(searchQuery || categoryFilter !== "All"
            ? filteredProducts
            : filteredProducts.slice(0, 12)
          ).map((p) => (
            <ProductCardMen key={p._id} product={p} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-navy text-brand-ivory py-8 text-center mt-12">
        <p className="font-body text-sm">© 2025 MyClothing. All rights reserved.</p>
      </footer>

      {/* CSS for scrolling */}
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
