// src/pages/Men.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Header from "../components/Header";
import LoginGuard from "../components/LoginGuard";
import ProductCardMen from "../components/ProductCardMen";
import BlurText from "../components/BlurText";
import ShinyText from "../components/ShinyText";
import { useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
import { useWishlist } from "./WishlistContext";

export default function Men() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [currentHero, setCurrentHero] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const BASE_URL = "http://localhost:5000/api";
  const navigate = useNavigate();
  const exploreRef = useRef(null);
  const { showLoginModal: cartLoginModal, setShowLoginModal: setCartLoginModal } = useCart();
  const { showLoginModal: wishlistLoginModal, setShowLoginModal: setWishlistLoginModal } = useWishlist();

  // Sync login modal from contexts
  useEffect(() => {
    if (cartLoginModal || wishlistLoginModal) {
      setShowLoginModal(true);
      setCartLoginModal(false);
      setWishlistLoginModal(false);
    }
  }, [cartLoginModal, wishlistLoginModal, setCartLoginModal, setWishlistLoginModal]);

  const heroImages = [
    "https://amzn-s3-cap-bucket.s3.us-east-2.amazonaws.com/men_homepage/men_hmpage1.jpg",
    "https://amzn-s3-cap-bucket.s3.us-east-2.amazonaws.com/men_homepage/men_hmpage2.jpg",
    "https://amzn-s3-cap-bucket.s3.us-east-2.amazonaws.com/men_homepage/men_hmpage3.jpg",
  ];

  // Hero autoplay
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [heroImages.length]);


  // ⭐⭐⭐ FETCH + PRIORITY SORTING FOR CANADA (Western-first)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/products`);
        const menProducts = res.data.filter((p) => p.Men === true);

        // 🇨🇦 Canadian Western Keywords (High Priority)
        const canadianPriority = [
          "jacket", "hoodie", "sweatshirt", "coat", "blazer",
          "denim", "jeans", "t-shirt", "tee", "shirt", "overshirt",
          "cargo", "trouser", "winter", "puffer", "windbreaker",
          "athleisure", "streetwear", "layer"
        ];

        // Indian Keywords (Low Priority)
        const indianKeywords = [
          "kurta", "sherwani", "indo western", "nehru",
          "pathani", "ethnic"
        ];

        const isMatch = (product, keywords) =>
          keywords.some((kw) =>
            product.title?.toLowerCase().includes(kw) ||
            product.description?.toLowerCase().includes(kw)
          );

        const canadianWestern = menProducts.filter((p) =>
          isMatch(p, canadianPriority)
        );

        const indianWear = menProducts.filter((p) =>
          isMatch(p, indianKeywords)
        );

        const neutral = menProducts.filter(
          (p) => !canadianWestern.includes(p) && !indianWear.includes(p)
        );

        const sorted = [...canadianWestern, ...neutral, ...indianWear];

        setProducts(sorted);
        setFilteredProducts(sorted);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, []);


  // Apply search + category filter
  const applyFilter = (query = "", category = "") => {
    let filtered = products.filter(
      (p) =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.description?.toLowerCase().includes(query.toLowerCase())
    );

    if (category !== "All") {
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(category.toLowerCase()) ||
        p.description?.toLowerCase().includes(category.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };


  // Trending carousel logic
  const trendingProducts = products.filter((p) => p.trending);

  const sliderBase = useMemo(() => {
    const base = [...trendingProducts];

    if (base.length < 4) {
      const extras = products.filter((p) => !p.trending);
      for (const p of extras) {
        if (base.length >= 4) break;
        if (!base.find((b) => b._id === p._id)) base.push(p);
      }
    }

    return base.slice(0, 4);
  }, [trendingProducts, products]);

  const repeatedTrending = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 6; i++) arr.push(...sliderBase);
    return arr;
  }, [sliderBase]);


  return (
    <div className="min-h-screen font-sansTrend bg-brand-mist">
      <Header />

      {/* HERO SECTION */}
      <div className="relative w-full h-[60vh] md:h-[75vh] overflow-hidden">
        {heroImages.map((img, idx) => (
          <motion.img
            key={idx}
            src={img}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: currentHero === idx ? 1 : 0 }}
            transition={{ duration: 1.2 }}
          />
        ))}

        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-4">
          <motion.h1
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2 }}
            className="text-white text-4xl md:text-6xl font-bold mb-4"
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
            onClick={() => exploreRef.current?.scrollIntoView({ behavior: "smooth" })}
            className="px-6 py-3 rounded-2xl bg-brand-gold text-brand-navy font-semibold hover:bg-brand-ivory hover:text-brand-navy transition"
          >
            Explore Now
          </motion.button>
        </div>
      </div>


      {/* SEARCH + CATEGORY SECTION */}
      <section className="px-6 md:px-20 py-12 flex flex-col items-center gap-6">

        {/* SEARCH BAR */}
        <div className="flex w-full md:w-1/2 gap-3">
          <input
            type="text"
            placeholder="Search men's fashion..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                applyFilter(searchQuery, categoryFilter);
                exploreRef.current?.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="flex-1 px-5 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-gold text-brand-navy text-lg shadow-sm"
          />

          <button
            onClick={() => {
              applyFilter(searchQuery, categoryFilter);
              exploreRef.current?.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-6 py-3 rounded-full bg-brand-navy text-brand-ivory font-semibold text-lg hover:bg-brand-gold hover:text-brand-navy transition-all shadow-md"
          >
            Search
          </button>
        </div>

        {/* CATEGORY FILTERS */}
        <div className="flex flex-wrap justify-center gap-3">
          {["All", "Jacket", "Shirt", "T-Shirt", "Jeans"].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategoryFilter(cat);
                applyFilter(searchQuery, cat);
                exploreRef.current?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`px-4 py-2 rounded-full font-semibold transition ${
                categoryFilter === cat
                  ? "bg-brand-navy text-brand-ivory border-brand-navy"
                  : "border-gray-300 text-gray-700 hover:bg-brand-mist border"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>


      {/* TRENDING SECTION */}
      {sliderBase.length > 0 && (
        <section className="py-8 px-6 md:px-20">
          <BlurText
            text="Trending Now"
            animateBy="words"
            direction="top"
            delay={100}
            className="text-5xl md:text-6xl font-fancy font-bold text-brand-navy mb-8 text-center"
          />

          <div
            className="relative "
            onMouseEnter={(e) => {
              const track = e.currentTarget.querySelector(".trending-track");
              if (track) track.style.animationPlayState = "paused";
            }}
            onMouseLeave={(e) => {
              const track = e.currentTarget.querySelector(".trending-track");
              if (track) track.style.animationPlayState = "running";
            }}
          >
            <div className="flex gap-6 whitespace-nowrap trending-track">
              {repeatedTrending.map((p, i) => (
                <div key={i} className="min-w-[250px] flex-shrink-0">
                  <ProductCardMen product={p} minimal={true} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}


      {/* EXPLORE PRODUCTS */}
      <section ref={exploreRef} className="py-16 px-6 md:px-20">
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


      {/* FOOTER */}
      <footer className="bg-brand-navy text-brand-ivory py-8 text-center mt-12">
        <p className="text-sm">© 2025 MyClothing. All rights reserved.</p>
      </footer>

      {/* SCROLL ANIMATION */}
      <style>
        {`
          .trending-track {
            width: max-content;
            animation: trending-marquee 25s linear infinite;
          }

          @keyframes trending-marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-16.66%); }
          }
        `}
      </style>

      <LoginGuard
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
}
