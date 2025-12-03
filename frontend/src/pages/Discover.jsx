// src/pages/DiscoverC.jsx
import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Header from "../components/Header";
import { ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import ProductCard from "../components/ProductCard";

export default function Discover() {
  const [spotlight, setSpotlight] = useState([]);
  const [discoverProducts, setDiscoverProducts] = useState([]);
  const [signatures, setSignatures] = useState([]);
  const [autoIndex, setAutoIndex] = useState(0);
  const [navOpen, setNavOpen] = useState(false);

  const navigate = useNavigate();

  // Fetch signatures and discover products
  useEffect(() => {
    const fetchAll = async () => {
      try {
        // Discover products (flagged in DB)
        const pRes = await api.get("/products?discover=true");
        setDiscoverProducts(Array.isArray(pRes.data) ? pRes.data : []);

        // Signatures
        const sRes = await api.get("/signatures");
        setSignatures(Array.isArray(sRes.data) ? sRes.data : []);

        // Use first few signatures as spotlight images if available
        const sp = (sRes.data || []).slice(0, 4).map((s) => ({
          id: s._id || s.id || s.slug,
          img: s.img || s.image || "/images/signature-placeholder.jpg",
          title: s.title || s.name || s.slug || "Signature",
        }));
        setSpotlight(sp);
      } catch (err) {
        console.error("Discover fetch error:", err);
      }
    };

    fetchAll();
  }, []);

  // Auto slide spotlight cards
  useEffect(() => {
    if (spotlight.length === 0) return;
    const interval = setInterval(() => {
      setAutoIndex((i) => (i + 1) % spotlight.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [spotlight]);

  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 300], [0, -60]);

  const pages = [
    { name: "Home", to: "/" },
    { name: "Men", to: "/men" },
    { name: "Women", to: "/women" },
    { name: "Wedding", to: "/wedding" },
    { name: "Signature", to: "/signature" },
    { name: "Discover", to: "/discover" },
    { name: "Cart", to: "/cart" },
    { name: "Wishlist", to: "/wishlist" },
    { name: "Accessories", to: "/accessories" },
    { name: "Jewelry", to: "/jewelry" },
    { name: "Checkout", to: "/checkout" },
  ];

  return (
    <div className="min-h-screen bg-brand-mist font-sansTrend">
      <Header />

      {/* HERO SECTION WITH PARALLAX */}
      <section className="relative pt-2 pb-20 md:px-2 text-center">
        <motion.img
          style={{ y: parallaxY }}
          src={spotlight[autoIndex]?.img || "https://picsum.photos/1600/600?random=30"}
          className="w-full h-[380px] md:h-[460px] object-cover rounded-3xl shadow-xl"
        />
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-10 text-5xl md:text-6xl font-sansTrend font-semibold tracking-tight text-gray-900"
        >
          Discover the <span className="text-brand-gold">Edit</span>
        </motion.h1>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-lg font-sansTrend">
          A curated showcase of stories, trends, and premium craftsmanship — reimagined for modern wear.
        </p>
      </section>

      <div className="w-full h-[6px] bg-gradient-to-r from-transparent via-brand-gold to-transparent "></div>

      {/* SPOTLIGHT AUTO SLIDER (Signature Highlights) */}
      <section className="px-6 py-2 md:py-2 flex flex-col md:flex-row items-center gap-12 bg-gradient-to-b from-mist to-brand-white">
        <div className="flex-1 space-y-4 text-left">
          <h2 className="text-xl md:text-4xl font-fancy leading-tight">
            Signature <span className="text-brand-gold">Highlights</span>
          </h2>
          <p className="text-gray-600 max-w-md font-sansTrend text-base">
            Handpicked signature pieces and editor favorites from our latest drops.
          </p>
          <div className="h-1 w-24 bg-brand-gold/40 rounded-full"></div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/signature")}
              className="px-4 py-2 rounded-md bg-brand-navy text-white"
            >
              View All Signature
            </button>
            <Link to="/signature-series" className="text-sm text-gray-700 hover:text-brand-gold flex items-center gap-2">
              Explore Series <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div className="flex-1 h-[340px] relative">
          {spotlight.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: i === autoIndex ? 1 : 0, scale: i === autoIndex ? 1 : 0.98 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl bg-white"
            >
              <img src={s.img} alt={s.title} className="w-full h-full object-cover" />
              <div className="absolute bottom-6 left-6 text-white text-2xl font-sansTrend font-medium drop-shadow-xl">
                {s.title}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="w-full h-[6px] bg-gradient-to-r from-transparent via-brand-navy to-transparent "></div>

      {/* DISCOVER PRODUCT GRID */}
      <section className="px-6 md:px-20 pb-24">
        <h3 className="text-3xl md:text-4xl font-sansTrend font-semibold mb-6">Discover Picks</h3>
        <p className="text-gray-600 mb-8">Curated items chosen for their craftsmanship and modern appeal.</p>

        {discoverProducts.length === 0 ? (
          <p className="text-gray-500">No discover picks available right now.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {discoverProducts.map((p) => (
              <ProductCard key={p.id || p._id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* SIGNATURE PREVIEW ROW */}
      <section className="px-6 md:px-20 pb-24">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-2xl font-semibold">Signature Preview</h4>
          <Link to="/signature" className="text-sm text-brand-gold">See all</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {signatures.slice(0, 6).map((s) => (
            <div
              key={s._id || s.id}
              onClick={() => navigate(`/signature/${s.slug || s._id}`)}
              className="cursor-pointer rounded-xl overflow-hidden bg-white shadow hover:scale-105 transition"
            >
              <img src={s.img || s.image || "/images/signature-placeholder.jpg"} className="w-full h-56 object-cover" />
              <div className="p-3">
                <h5 className="font-semibold">{s.title || s.name || s.slug}</h5>
                <p className="text-sm text-gray-600 mt-1">{s.subtitle || s.description || "Signature piece"}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* COMPACT NAV DRAWER (does not alter layout) */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setNavOpen((v) => !v)}
          className="bg-brand-navy text-white rounded-full p-3 shadow-lg hover:scale-105 transition"
          aria-label="Open navigation"
        >
          ☰
        </button>

        {navOpen && (
          <div className="mt-3 w-64 bg-white rounded-xl shadow-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <strong className="text-sm">Quick Navigation</strong>
              <button onClick={() => setNavOpen(false)} className="text-gray-500">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {pages.map((pg) => (
                <Link
                  key={pg.to}
                  to={pg.to}
                  onClick={() => setNavOpen(false)}
                  className="text-sm p-2 rounded hover:bg-brand-mist/60"
                >
                  {pg.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CRAFT TIMELINE */}
      <section className="px-6 md:px-20 pb-24">
        <h3 className="text-3xl font-sansTrend font-semibold mb-12">Behind the Craft</h3>
        <div className="space-y-12">
          {[
            ["Design", "Where imagination meets fabric."],
            ["Cutting", "Precision cuts by master artisans."],
            ["Embroidery", "Handcrafted detailing with heritage methods."],
            ["Finish", "Final touches with luxury-grade polish."],
          ].map(([title, desc], i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-6"
            >
              <div className="h-16 w-16 rounded-full bg-brand-gold/30 flex items-center justify-center text-xl font-sansTrend font-semibold text-brand-navy">
                {i + 1}
              </div>
              <div>
                <h4 className="text-xl font-sansTrend font-semibold">{title}</h4>
                <p className="text-gray-600 mt-1 font-sansTrend">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="py-12 text-center text-gray-600 font-sansTrend">
        © 2025 Royal Threads — Crafted With Precision
      </footer>
    </div>
  );
}
