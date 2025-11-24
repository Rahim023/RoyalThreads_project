// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, useScroll, useTransform } from "framer-motion";
import Header from "../components/Header";
import BlurText from "../components/BlurText";
import ShinyText from "../components/ShinyText";
import ProductCard from "../components/ProductCard";
import CircularGallery from "../components/CircularGallery";
import Silk from "../components/Silk";

/**
 * Modern Minimal — Gradient Luxury Hero (sans-only)
 * Backend logic is unchanged. Visual improvements for Trending and Other Products.
 */

export default function Home() {
  const navigate = useNavigate();
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [otherProducts, setOtherProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const trendingRes = await axios.get("http://localhost:5000/api/products/trending");
        const allRes = await axios.get("http://localhost:5000/api/products");

        const mappedTrending = trendingRes.data.map((p) => ({
          ...p,
          id: p._id,
          title: p.title || p.name,
          img: p.img || p.image,
        }));

        const mappedAll = allRes.data.map((p) => ({
          ...p,
          id: p._id,
          title: p.title || p.name,
          img: p.img || p.image,
        }));

        setTrendingProducts(mappedTrending);

        const others = mappedAll.filter((p) => !p.trending).slice(0, 8);
        setOtherProducts(others);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  /* Sparkle Dots (background decorative) */
  const Sparkles = () => (
    <div className="pointer-events-none absolute inset-0 overflow-hidden -z-10">
      {[...Array(30)].map((_, i) => (
        <span
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full opacity-50 animate-twinkle"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        />
      ))}
    </div>
  );

  /* Gradient Orbs decorative */
  const GradientOrbs = () => (
    <>
      <div className="absolute -top-10 -left-10 w-60 h-60 bg-brand-gold/30 blur-3xl rounded-full" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-brand-navy/40 blur-[110px] rounded-full" />
    </>
  );

  // Parallax for floating card in hero
  const { scrollY } = useScroll();
  const floatY = useTransform(scrollY, [0, 400], [0, -30]);

  return (
    <div className="min-h-screen flex flex-col px-2 relative overflow-hidden font-sansTrend">
      <Header />
      <Sparkles />

      {/* ================= HERO ================= */}
      <section className="relative flex items-center justify-center min-h-screen">
        <div className="absolute inset-0 -z-20 bg-gradient-to-b from-[#fff8f0] via-[#fffaf6] to-white" />

        <div className="absolute inset-0 -z-10">
          <Silk speed={5} scale={1.5} color="#f5f0e6" noiseIntensity={0} rotation={0} />
        </div>

        <div className="relative text-center px-6 md:px-12 max-w-3xl">
          <h1 className="text-6xl md:text-8xl font-bold leading-tight tracking-tight text-gray-900 mb-6">
            Modern Luxury, Carefully Curated
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-10">
            Handpicked collections and editorial stories — crafted for elegance and everyday wear.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <button
              onClick={() => scrollToSection("trending")}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-brand-gold text-brand-navy font-semibold transition"
            >
              Shop Trending
            </button>

            <button
              onClick={() => navigate("/discover")}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl border border-gray-200 bg-white text-gray-800 transition"
            >
              Discover Stories
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-3 rounded-full bg-white/60 px-3 py-2 shadow-sm">
              <div className="w-2 h-2 bg-brand-gold rounded-full" />
              <span className="text-sm text-gray-700">Premium Fabrics</span>
            </div>
            <div className="flex items-center gap-3 rounded-full bg-white/60 px-3 py-2 shadow-sm">
              <div className="w-2 h-2 bg-brand-navy rounded-full" />
              <span className="text-sm text-gray-700">Crafted By Artisans</span>
            </div>
          </div>
        </div>
      </section>

      <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-brand-gold to-transparent" />

      {/* ================= COLLECTIONS (full screen height, no hover) ================= */}
      <section id="collections" className="relative mt-0">
        <div className="width-full flex flex-col">
          <div className="grid grid-cols-1 md:grid-cols-2 h-screen gap-0">
            <div
              className="relative rounded-none overflow-hidden cursor-pointer"
              onClick={() => navigate("/women")}
            >
              <img src="https://picsum.photos/id/1011/1600/1100" className="w-full h-full object-cover" alt="Women Fashion" />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-4xl md:text-5xl font-semibold">Explore Women’s Fashion</div>
                </div>
              </div>
            </div>

            <div
              className="relative rounded-none overflow-hidden cursor-pointer"
              onClick={() => navigate("/men")}
            >
              <img src="https://picsum.photos/id/1012/1600/1100" className="w-full h-full object-cover" alt="Men Fashion" />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-4xl md:text-5xl font-semibold">Explore Men’s Fashion</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


  

      {/* ================= TRENDING (enhanced UI) ================= */}
      <section id="trending" className="py-12 md:py-16 bg-gradient-to-b from-brand-navy to-brand-mist">
        <div className=" px-6 md:px-12">
          <motion.h2
            initial={{ opacity: 0, y: -12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center text-4xl md:text-5xl font-medium text-brand-ivory mb-8"
            style={{ fontFamily: "Poppins, system-ui, sans-serif" }}
          >
            Trending Now
          </motion.h2>

          {trendingProducts.length > 0 ? (
            <>
              {/* Circular Gallery */}
              <div className="rounded-2xl ">
                <CircularGallery
                  items={trendingProducts.map((p) => ({
                    image: p.img || p.image,
                    text: p.title,
                  }))}
                />
              </div>

              
            </>
          ) : (
            <p className="text-center text-white mt-8">No trending products available.</p>
          )}
        </div>
      </section>

      {/* ================= OTHER PRODUCTS GRID ================= */}
      <section id="other-products" className="pb-20 bg-gradient-to-b from-brand-mist to-brand-navy px-2 md:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center py-12 text-4xl md:text-5xl font-semibold text-brand-navy"
            style={{ fontFamily: "Poppins, system-ui, sans-serif" }}
          >
            Other Products
          </motion.h2>

          {loading ? (
            <p className="text-center text-brand-navy font-sansTrend">Loading products...</p>
          ) : otherProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {otherProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-center text-brand-navy font-sansTrend">No products available.</p>
          )}
        </div>
      </section>

      {/* ================= NEWSLETTER ================= */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-brand-navy" style={{ fontFamily: "Poppins, system-ui, sans-serif" }}>
            Stay in the Loop
          </h2>
          <p className="mt-3 text-gray-700">
            Subscribe for updates, early access and exclusive collections.
          </p>

          <form className="mt-6 flex items-center justify-center gap-0 shadow-sm rounded-full overflow-hidden max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-3 w-full border-0 focus:outline-none"
            />
            <button className="px-6 py-3 bg-brand-gold text-brand-navy font-semibold hover:bg-brand-ivory transition">
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-brand-navy text-brand-ivory py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="mb-4 font-semibold">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li>Women</li>
              <li>Men</li>
              <li>Wedding</li>
              <li>Discover</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Help</h4>
            <ul className="space-y-2 text-sm">
              <li>Contact Us</li>
              <li>Shipping</li>
              <li>Returns</li>
              <li>FAQ</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">About</h4>
            <ul className="space-y-2 text-sm">
              <li>Our Story</li>
              <li>Careers</li>
              <li>Sustainability</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Follow Us</h4>
            <ul className="space-y-2 text-sm">
              <li>Instagram</li>
              <li>Facebook</li>
              <li>Twitter</li>
            </ul>
          </div>
        </div>

        <p className="text-center text-sm mt-6">
          © 2025 MyClothing. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
