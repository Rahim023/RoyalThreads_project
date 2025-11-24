// src/pages/DiscoverC.jsx
import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Header from "../components/Header";

export default function DiscoverC() {
  const [autoIndex, setAutoIndex] = useState(0);
  const spotlight = [
    { id: 1, title: "Signature Embroidery", img: "https://picsum.photos/600?random=11" },
    { id: 2, title: "Royal Fabrics", img: "https://picsum.photos/600?random=12" },
    { id: 3, title: "Modern Silhouettes", img: "https://picsum.photos/600?random=13" },
    { id: 4, title: "Crafted Tailoring", img: "https://picsum.photos/600?random=14" },
  ];

  useEffect(() => {
    const t = setInterval(() => {
      setAutoIndex((i) => (i + 1) % spotlight.length);
    }, 2500);
    return () => clearInterval(t);
  }, []);

  // Parallax effect
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 300], [0, -60]);

  const tiles = [
    { t: "Royal Craft", img: "https://picsum.photos/700?random=21" },
    { t: "Trending Edits", img: "https://picsum.photos/700?random=22" },
    { t: "Runway Notes", img: "https://picsum.photos/700?random=23" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#faf6ef] font-sans">
      <Header />

      {/* ⭐ HERO SECTION WITH PARALLAX */}
      <section className="relative py-28 px-6 md:px-20 text-center">
        <motion.img
          style={{ y: parallaxY }}
          src="https://picsum.photos/1600/600?random=30"
          className="w-full h-[380px] md:h-[460px] object-cover rounded-3xl shadow-xl"
        />
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-10 text-5xl md:text-6xl font-semibold tracking-tight text-gray-900"
        >
          Discover the <span className="text-brand-gold">Edit</span>
        </motion.h1>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-lg">
          A curated showcase of stories, trends, and premium craftsmanship —  
          reimagined in a modern luxury format.
        </p>
      </section>

      {/* ⭐ SPOTLIGHT AUTO CARDS (Premium Side Section) */}
      <section className="px-6 md:px-20 py-20 flex flex-col md:flex-row items-center gap-14">
        {/* LEFT TEXT */}
        <div className="flex-1 space-y-4">
          <h2 className="text-4xl md:text-5xl font-semibold leading-tight">
            Premium <span className="text-brand-gold">Spotlight</span>
          </h2>
          <p className="text-gray-600 max-w-md text-lg">
            Inspired by global runway trends and handcrafted traditions.
          </p>

          <div className="h-1 w-32 bg-brand-gold/40 rounded-full"></div>
        </div>

        {/* RIGHT AUTO SLIDER */}
        <div className="flex-1 h-[350px] relative">
          {spotlight.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{
                opacity: i === autoIndex ? 1 : 0,
                scale: i === autoIndex ? 1 : 0.95,
              }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl bg-white"
            >
              <img src={s.img} className="w-full h-full object-cover" />
              <div className="absolute bottom-6 left-6 text-white text-2xl font-semibold drop-shadow-xl">
                {s.title}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ⭐ GLASS GRID (MAGAZINE STYLE) */}
      <section className="px-6 md:px-20 pb-24">
        <h3 className="text-3xl font-semibold mb-10">Feature Collections</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiles.map((c, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              className="relative overflow-hidden rounded-3xl shadow-xl bg-white/50 backdrop-blur-lg"
            >
              <img src={c.img} className="h-72 w-full object-cover" />
              <div className="absolute inset-0 bg-black/20"></div>

              <div className="absolute bottom-6 left-6 text-white text-2xl font-medium drop-shadow-lg">
                {c.t}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ⭐ CRAFT TIMELINE — PREMIUM */}
      <section className="px-6 md:px-20 pb-24">
        <h3 className="text-3xl font-semibold mb-12">Behind the Craft</h3>

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
              <div className="h-16 w-16 rounded-full bg-brand-gold/30 flex items-center justify-center text-xl font-semibold text-brand-navy">
                {i + 1}
              </div>

              <div>
                <h4 className="text-xl font-semibold">{title}</h4>
                <p className="text-gray-600 mt-1">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="py-12 text-center text-gray-600">
        © 2025 MyClothing — Crafted With Precision
      </footer>
    </div>
  );
}
