// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import Header from "../components/Header";
import BlurText from "../components/BlurText";
import ShinyText from "../components/ShinyText";
import ProductCard from "../components/ProductCard";
import CircularGallery from "../components/CircularGallery";
import Silk from "../components/Silk";

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

        const mappedTrending = trendingRes.data.map(p => ({
          ...p,
          id: p._id,
          title: p.title || p.name,
          img: p.img || p.image,
        }));

        const mappedAll = allRes.data.map(p => ({
          ...p,
          id: p._id,
          title: p.title || p.name,
          img: p.img || p.image,
        }));

        setTrendingProducts(mappedTrending);

        const others = mappedAll.filter(p => !p.trending).slice(0, 8);
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

  /* Sparkle Dots */
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

  /* Gradient Orbs */
  const GradientOrbs = () => (
    <>
      <div className="absolute -top-10 -left-10 w-60 h-60 bg-brand-gold/30 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-brand-navy/40 blur-[110px] rounded-full"></div>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col px-2 relative overflow-hidden font-sansTrend">
      <Header />
      <Sparkles />

      {/* HERO SECTION */}
      <section className="relative flex flex-col items-center justify-center text-center 
      overflow-hidden min-h-[550px] md:min-h-[750px]">
        <div className="absolute inset-0 -z-10">
          <Silk speed={5} scale={1} color="#f5f0e6" noiseIntensity={0} rotation={0} />
        </div>
        <GradientOrbs />
        <BlurText
          text="Discover Your Royal Style!"
          delay={150}
          animateBy="words"
          direction="top"
          className="text-4xl md:text-5xl font-serifFancy font-medium text-black"
        />
        <ShinyText
          text="Curated collections crafted for elegance."
          speed={3}
          className="mt-4 text-lg font-script text-black"
        />
        <motion.button
          onClick={() => scrollToSection("trending")}
          whileHover={{ scale: 1.1 }}
          className="mt-6 px-7 py-3 bg-brand-gold text-brand-navy font-semibold rounded-2xl border-2 border-brand-navy hover:bg-brand-ivory hover:text-brand-navy transition"
        >
          Shop Now
        </motion.button>
      </section>
      <div className="w-full h-[8px] bg-gradient-to-r from-transparent via-brand-gold to-transparent "></div>

      {/* --- COLLECTIONS SECTIONS --- */}
      {/* Destination Cozy */}
      <section id="collections" className="relative">
        <div className="relative flex w-full h-[60vh] md:h-[80vh] overflow-hidden">
          {/* Women */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="w-1/2 h-full relative cursor-pointer"
            onClick={() => navigate("/women")}
          >
            <img
              src="https://picsum.photos/id/1011/1200/800"
              className="w-full h-full object-cover"
              alt="Women Fashion"
            />
            <p
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-2xl md:text-3xl font-serifFancy text-white drop-shadow-lg cursor-pointer hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                navigate("/women");
              }}
            >
              Explore Women’s Fashion
            </p>
          </motion.div>

          {/* Men */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="w-1/2 h-full relative cursor-pointer"
            onClick={() => navigate("/men")}
          >
            <img
              src="https://picsum.photos/id/1012/1200/800"
              className="w-full h-full object-cover"
              alt="Men Fashion"
            />
            <p
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-2xl md:text-3xl font-serifFancy text-white drop-shadow-lg cursor-pointer hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                navigate("/men");
              }}
            >
              Explore Men’s Fashion
            </p>
          </motion.div>

          {/* Center Title */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none"
          >
            <h2 className="text-4xl md:text-5xl font-serifFancy text-white drop-shadow-lg">
              Destination: Cozy
            </h2>
            <p className="mt-2 text-lg md:text-xl font-sansTrend text-white drop-shadow-md">
              Your curated style experience awaits
            </p>
          </motion.div>
        </div>
      </section>

      {/* Explore More Section */}
      <section id="explore-more" className="relative">
        <div className="relative flex w-full h-[60vh] md:h-[80vh] overflow-hidden">
          {/* Signature */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="w-1/2 h-full relative cursor-pointer"
            onClick={() => navigate("/signature")}
          >
            <img
              src="https://picsum.photos/id/1015/1200/800"
              className="w-full h-full object-cover"
              alt="Signature Collection"
            />
            <p
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-2xl md:text-3xl font-serifFancy text-white drop-shadow-lg cursor-pointer hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                navigate("/signature");
              }}
            >
              Explore Signature
            </p>
          </motion.div>

          {/* Kids */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="w-1/2 h-full relative cursor-pointer"
            onClick={() => navigate("/kids")}
          >
            <img
              src="https://picsum.photos/id/1016/1200/800"
              className="w-full h-full object-cover"
              alt="Kids Collection"
            />
            <p
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-2xl md:text-3xl font-serifFancy text-white drop-shadow-lg cursor-pointer hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                navigate("/kids");
              }}
            >
              Explore Kids
            </p>
          </motion.div>

          {/* Center Title */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none"
          >
            <h2 className="text-4xl md:text-5xl font-serifFancy text-white drop-shadow-lg">
              Explore More
            </h2>
            <p className="mt-2 text-lg md:text-xl font-sansTrend text-white drop-shadow-md">
              Discover our exclusive collections
            </p>
          </motion.div>
        </div>
      </section>
      <div className="w-full h-[8px] bg-gradient-to-r from-transparent via-brand-gold to-transparent "></div>

      {/* Trending Section */}
      <section id="trending" className="py-10 bg-gradient-to-b from-brand-navy to-brand-mist md:px-16">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center text-4xl md:text-5xl font-serifFancy text-brand-mist"
        >
          Trending Now
        </motion.h2>

        <div className="w-full h-full mt-10">
          {trendingProducts.length > 0 ? (
            <CircularGallery
              items={trendingProducts.map(p => ({
                image: p.img || p.image,
                text: p.title,
              }))}
            />
          ) : (
            <p className="text-center text-white mt-8">No trending products available.</p>
          )}
        </div>
      </section>
      <div className="w-full h-[8px] bg-gradient-to-r from-transparent via-brand-gold to-transparent "></div>

      {/* Other Products Section */}
      <section id="other-products" className="pb-20 bg-gradient-to-b from-brand-mist to-brand-navy px-2 md:px-16">
        <motion.h2
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center py-12 text-4xl md:text-5xl font-serifFancy text-brand-navy"
        >
          Other Products
        </motion.h2>

        {loading ? (
          <p className="text-center text-brand-navy font-sansTrend">Loading products...</p>
        ) : otherProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {otherProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-brand-navy font-sansTrend">No products available.</p>
        )}
      </section>

      {/* Newsletter */}
      <section className="py-16 text-center bg-white font-sansTrend">
        <h2 className="text-3xl md:text-4xl font-serifFancy text-brand-navy">
          Stay in the Loop
        </h2>
        <p className="mt-2 text-brand-charcoal/80">
          Subscribe for updates, offers, and exclusive collections.
        </p>

        <div className="mt-6 flex justify-center gap-2">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-2 rounded-l-lg border border-gray-300 w-72 focus:ring-2 focus:ring-brand-gold"
          />
          <button className="px-6 py-2 rounded-r-lg bg-brand-gold text-brand-charcoal hover:bg-brand-navy hover:text-white transition">
            Subscribe
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-navy text-brand-ivory py-10 mt-auto font-sansTrend">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-serifFancy mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li>Women</li>
              <li>Men</li>
              <li>Wedding</li>
              <li>Discover</li>
            </ul>
          </div>

          <div>
            <h4 className="font-serifFancy mb-4">Help</h4>
            <ul className="space-y-2 text-sm">
              <li>Contact Us</li>
              <li>Shipping</li>
              <li>Returns</li>
              <li>FAQ</li>
            </ul>
          </div>

          <div>
            <h4 className="font-serifFancy mb-4">About</h4>
            <ul className="space-y-2 text-sm">
              <li>Our Story</li>
              <li>Careers</li>
              <li>Sustainability</li>
            </ul>
          </div>

          <div>
            <h4 className="font-serifFancy mb-4">Follow Us</h4>
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
