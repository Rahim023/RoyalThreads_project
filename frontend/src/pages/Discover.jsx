// src/pages/DiscoverC.jsx
import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Header from "../components/Header";
import { LucideArrowRight } from "lucide-react";

export default function Discover() {
  const [spotlight, setSpotlight] = useState([]);
  const [tiles, setTiles] = useState([]);
  const [autoIndex, setAutoIndex] = useState(0);

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/discover");
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const data = await res.json();
        setSpotlight(data.spotlight || []);
        setTiles(data.tiles || []);
      } catch (err) {
        console.error("Error fetching discover data:", err);
      }
    };
    fetchData();
  }, []);

  // Auto slide spotlight cards
  useEffect(() => {
    if (spotlight.length === 0) return;
    const interval = setInterval(() => {
      setAutoIndex((i) => (i + 1) % spotlight.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [spotlight]);

  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 300], [0, -60]);

  return (
    <div className="min-h-screen bg-brand-mist font-sansTrend">
      <Header />

      {/* HERO SECTION WITH PARALLAX */}
      <section className="relative pt-2 pb-20 md:px-2 text-center">
        <motion.img
          style={{ y: parallaxY }}
          src="https://picsum.photos/1600/600?random=30"
          className="w-full h-[380px] md:h-[460px] object-cover rounded-3xl shadow-xl"
        />
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-10 text-6xl md:text-6xl font-sansTrend font-semibold tracking-tight text-gray-900"
        >
          Discover the <span className="text-brand-gold">Edit</span>
        </motion.h1>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-lg font-sansTrend">
          A curated showcase of stories, trends, and premium craftsmanship —
          reimagined in a modern luxury format.
        </p>
      </section>

      <div className="w-full h-[8px] bg-gradient-to-r from-transparent via-brand-gold to-transparent "></div>

      {/* SPOTLIGHT AUTO SLIDER */}
      <section className="px-6 py-2 md:py-2 flex flex-col md:flex-row items-center gap-14 bg-gradient-to-b from-mist to-brand-white">
        {/* LEFT TEXT */}
        <div className="flex-1 space-y-4">
          <h2 className="text-xl md:text-6xl font-fancy leading-tight">
            Premium <span className="text-brand-gold">Spotlight</span>
          </h2>
          <p className="text-gray-600 max-w-md font-sansTrend text-lg">
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
              <div className="absolute bottom-6 left-6 text-white text-2xl font-sansTrend font-medium drop-shadow-xl">
                {s.title}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="w-full h-[8px] bg-gradient-to-r from-transparent via-brand-navy to-transparent "></div>

      {/* CURATED COLLECTIONS */}
      <section className="px-6 md:px-20 pb-24 text-center">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl font-fancy pt-10 text-brand-gold"
        >
          Curated <span className="text-brand-maroon">Selections</span>
        </motion.h3>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mt-2 text-gray-600 text-lg max-w-lg mx-auto font-sansTrend"
        >
          Explore handpicked pieces showcasing the finest craftsmanship and trending styles.
        </motion.p>
        <div className="h-1 w-32 bg-brand-maroon/40 mb-12 mt-4 mx-auto rounded-full"></div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiles.map((c) => (
            <motion.div
              key={c.id}
              whileHover={{ scale: 1.05 }}
              className="relative overflow-hidden rounded-3xl shadow-xl bg-white/50 backdrop-blur-lg cursor-pointer"
            >
              <img src={c.img} className="h-72 w-full object-cover" />
              <div className="absolute inset-0 bg-black/20"></div>
              <motion.div
                whileHover={{ x: 5 }}
                className="absolute bottom-6 left-6 text-white text-2xl font-sansTrend font-medium drop-shadow-lg flex items-center gap-2"
              >
                {c.title} <LucideArrowRight size={20} />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

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
        © 2025 MyClothing — Crafted With Precision
      </footer>
    </div>
  );
}
