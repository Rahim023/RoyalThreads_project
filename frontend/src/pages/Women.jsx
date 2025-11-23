import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion, useAnimation, useInView } from "framer-motion";
import { LucideSearch, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import CardSwap, { Card } from "../components/CardSwap";
import BlurText from "../components/BlurText";
import ShinyText from "../components/ShinyText";

export default function Women() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentHero, setCurrentHero] = useState(0);
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterOpen, setFilterOpen] = useState(false);

  const navigate = useNavigate();
  const BASE_URL = "http://localhost:5000/api";
  const filterRef = useRef(null);

  const heroImages = [
    "https://amzn-s3-cap-bucket.s3.us-east-2.amazonaws.com/women_homepage/women_homepage1.jpg",
    "https://amzn-s3-cap-bucket.s3.us-east-2.amazonaws.com/women_homepage/women_homepage2.webp",
    "https://amzn-s3-cap-bucket.s3.us-east-2.amazonaws.com/women_homepage/women_homepage3.jpg",
  ];

  // Hero carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Fetch products
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

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search filter
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    applyFilters(query, filterCategory);
  };

  // Apply filter dynamically (boolean category fields)
  const applyFilters = (query, category) => {
    let filtered = products.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        (p.description && p.description.toLowerCase().includes(query))
    );

    if (category === "Western") filtered = filtered.filter((p) => p.Western);
    else if (category === "Indian") filtered = filtered.filter((p) => p.Indian);

    setFilteredProducts(filtered);
  };

  // Handle filter click
  const handleFilterClick = (category) => {
    setFilterCategory(category);
    applyFilters(searchQuery, category);
    setFilterOpen(false);
  };

  // Featured products are always trending, independent of filters
  const featuredProducts = products.filter((p) => p.trending).slice(0, 5);

  // Scroll animation for featured section
  const featuredRef = useRef(null);
  const isInView = useInView(featuredRef, { margin: "-100px" });
  const featuredControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      featuredControls.start({ opacity: 1, y: 0 });
    } else {
      featuredControls.start({ opacity: 0, y: 50 });
    }
  }, [isInView]);

  return (
    <div className="min-h-screen bg-brand-mist font-sansTrend">
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
            className="text-white text-4xl md:text-6xl font-serifFancy font-bold mb-4"
          >
            Women’s Fashion Collection
          </motion.h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 rounded-lg bg-brand-gold text-brand-navy font-semibold hover:bg-brand-ivory hover:text-brand-navy transition"
            onClick={() => window.scrollTo({ top: 600, behavior: "smooth" })}
          >
            Shop Now
          </motion.button>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="px-6 md:px-20 py-8 flex flex-wrap justify-center gap-4 relative">
        <div className="relative flex-1 max-w-lg">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-navy transition pl-10"
          />
          <LucideSearch
            className="absolute left-3 top-3.5 text-gray-400"
            size={20}
          />
        </div>

        {/* Filter Dropdown */}
        <div className="relative" ref={filterRef}>
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center gap-2 px-4 py-3 rounded-lg border border-gray-300 bg-white hover:bg-gray-50"
          >
            <Filter size={18} />
            Filter
          </button>
          {filterOpen && (
            <div className="absolute mt-1 bg-white shadow-lg rounded-lg overflow-hidden w-40 z-50">
              <button
                className="block w-full text-left px-4 py-2 hover:bg-brand-mist"
                onClick={() => handleFilterClick("Western")}
              >
                Western
              </button>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-brand-mist"
                onClick={() => handleFilterClick("Indian")}
              >
                Indian
              </button>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-brand-mist"
                onClick={() => handleFilterClick("All")}
              >
                All
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Featured Products with BlurText & ShinyText */}
      {featuredProducts.length > 0 && (
        <section
          ref={featuredRef}
          className="px-6 md:px-20 pt-24 pb-20 flex flex-col md:flex-row items-center md:items-stretch gap-12 relative overflow-hidden"
        >
          <motion.div
            animate={featuredControls}
            transition={{ type: "spring", stiffness: 80, damping: 12 }}
            className="flex-1 flex flex-col justify-center"
          >
            <BlurText
              text="Featured Products"
              delay={100}
              animateBy="words"
              direction="top"
              className="text-5xl md:text-6xl font-serifFancy font-bold text-brand-navy mb-4"
            />
            <ShinyText
              text="Check out our trending collection from all categories"
              speed={5}
              className="text-lg md:text-xl text-gray-600"
            />
          </motion.div>

          {/* CardSwap */}
          <div className="flex-1 flex justify-end">
            <div className="card-swap-wrapper">
              <CardSwap
                cardDistance={50}
                verticalDistance={30}
                delay={5000}
                pauseOnHover={false}
                width={400}
                height={400}
              >
                {featuredProducts.map((product) => (
                  <Card key={product._id}>
                    <img
                      src={product.img}
                      alt={product.title}
                      className="w-full h-64 object-cover rounded-lg mb-2 shadow-luxe"
                    />
                    <h3 className="text-center font-semibold">{product.title}</h3>
                  </Card>
                ))}
              </CardSwap>
            </div>
          </div>
        </section>
      )}

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

      {/* Subscription */}
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
