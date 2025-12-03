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
import CollectionSlideshow from "../components/CollectionSlideshow";
import EmailSubscriptionModal from "../components/EmailSubscriptionModal";
import { collectionData } from "../data/collectionImages";

export default function Home() {
  const navigate = useNavigate();
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [otherProducts, setOtherProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEmailModal, setShowEmailModal] = useState(false);

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
          className="absolute w-1 h-1 bg-white rounded-full opacity-40 animate-twinkle"
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
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-brand-gold/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-navy/50 blur-[150px] rounded-full"></div>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col px-3 md:px-4 relative overflow-hidden font-sansTrend">
      <Header />
      <Sparkles />

      {/* HERO */}
      <section className="relative flex flex-col items-center justify-center text-center 
      overflow-hidden min-h-[650px] md:min-h-[900px] pt-10">
        <div className="absolute inset-0 -z-10 opacity-80">
          <Silk speed={5} scale={1.2} highlightColor="#D4C7B0" noiseIntensity={0.05} rotation={0} />
        </div>
        <GradientOrbs />

        <BlurText
          text="Discover Your Royal Style!"
          delay={150}
          animateBy="words"
          direction="top"
          className="text-4xl md:text-7xl font-bold text-brand-ivory drop-shadow-xl tracking-wide"
        />

        <ShinyText
          text="Curated collections crafted for elegance."
          speed={3}
          className="mt-4 text-3xl md:text-4xl font-script text-brand-gold drop-shadow-2xl"
        />

        <motion.button
          onClick={() => scrollToSection("trending")}
          whileHover={{ scale: 1.1 }}
          className="mt-8 px-10 py-4 bg-brand-gold/90 text-brand-navy font-semibold 
          rounded-2xl border-2 border-brand-navy shadow-xl 
          hover:bg-brand-ivory hover:text-brand-navy transition"
        >
          Shop Now
        </motion.button>
      </section>

      <div className="w-full h-[10px] bg-gradient-to-r from-transparent via-brand-gold to-transparent mt-8"></div>

      {/* COLLECTIONS SLIDESHOW - Women & Men */}
      <section id="collections" className="relative py-12 px-4 md:px-8">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 text-4xl md:text-6xl font-serifFancy text-brand-navy"
        >
          Our Collections
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {collectionData.slice(0, 2).map((collection, idx) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: idx * 0.2 }}
            >
              <CollectionSlideshow
                images={collection.images}
                title={collection.title}
                link={collection.link}
                autoPlay={true}
                interval={4000}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Signature & Wedding Collections */}
      <section id="explore-more" className="relative py-12 px-4 md:px-8">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 text-4xl md:text-6xl font-serifFancy text-brand-navy"
        >
          Exclusive Collections
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {collectionData.slice(2, 4).map((collection, idx) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: idx * 0.2 }}
            >
              <CollectionSlideshow
                images={collection.images}
                title={collection.title}
                link={collection.link}
                autoPlay={true}
                interval={4000}
              />
              
            </motion.div>
          ))}
        </div>
      </section>

      <div className="w-full h-[10px] bg-gradient-to-r from-transparent via-brand-gold to-transparent"></div>

      {/* Trending */}
      <section id="trending" className="py-16 bg-brand-mist md:px-16 rounded-t-3xl shadow-inner">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl font-fancy text-center pt-10 text-brand-gold/90"
        >
          Explore the <span className="text-brand-navy">Trending</span>
          <div className="h-1 w-48 bg-brand-navy/60 mb-6 mt-4 mx-auto rounded-full"></div>
        </motion.h3>

        <p className="text-brand-maroon max-w-xl text-center font-sansTrend font-light mx-auto mt-2 text-lg">
          Inspired by global runway trends and handcrafted traditions.
        </p>

        <div className="w-full h-full mt-12">
          {trendingProducts.length > 0 ? (
            <CircularGallery
              items={trendingProducts.map(p => ({
                image: p.img || p.image,
                text: p.title,
              }))}
            />
          ) : (
            <p className="text-center text-brand-navy mt-8">No trending products available.</p>
          )}
        </div>
      </section>

      <div className="w-full h-[10px] bg-gradient-to-r from-transparent via-brand-gold to-transparent"></div>

      {/* Other Products */}
      <section id="other-products" className="pb-20 bg-gradient-to-b from-brand-mist to-brand-navy px-4 md:px-16 rounded-t-3xl">
        <motion.h2
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center py-12 text-5xl font-serifFancy text-brand-navy"
        >
          Other Products
        </motion.h2>

        {loading ? (
          <p className="text-center text-brand-navy font-sansTrend">Loading products...</p>
        ) : otherProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {otherProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-brand-navy font-sansTrend">No products available.</p>
        )}
      </section>

      {/* Newsletter */}
      <section className="py-20 text-center bg-white font-sansTrend">
        <h2 className="text-4xl md:text-5xl font-serifFancy text-brand-navy">
          Stay in the Loop
        </h2>
        <p className="mt-2 text-brand-charcoal/80">
          Subscribe for updates, offers, and exclusive collections.
        </p>

        <div className="mt-6 flex justify-center gap-2">
          <input
            type="email"
            placeholder="Enter your email"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && e.target.value) {
                setShowEmailModal(true);
              }
            }}
            className="px-4 py-3 rounded-l-lg border border-gray-300 w-72 focus:ring-2 focus:ring-brand-gold"
          />
          <button 
            onClick={() => setShowEmailModal(true)}
            className="px-6 py-3 rounded-r-lg bg-brand-gold text-brand-charcoal 
          hover:bg-brand-navy hover:text-white transition shadow-lg font-semibold">
            Subscribe
          </button>
        </div>
      </section>

      {/* Email Subscription Modal */}
      <EmailSubscriptionModal 
        isOpen={showEmailModal}
        closeModal={() => setShowEmailModal(false)}
        onSubmit={async (email) => {
          try {
            // You can add API call here to save the email
            console.log("Subscribed with email:", email);
            // await axios.post("http://localhost:5000/api/subscribe", { email });
          } catch (err) {
            console.error("Subscription error:", err);
            throw err;
          }
        }}
      />

      {/* Footer */}
      <footer className="bg-brand-navy text-brand-ivory py-14 mt-auto font-sansTrend shadow-inner">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
          <div>
            <h4 className="font-serifFancy mb-4 text-lg">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li>Women</li>
              <li>Men</li>
              <li>Wedding</li>
              <li>Discover</li>
            </ul>
          </div>
          <div>
            <h4 className="font-serifFancy mb-4 text-lg">Help</h4>
            <ul className="space-y-2 text-sm">
              <li>Contact Us</li>
              <li>Shipping</li>
              <li>Returns</li>
              <li>FAQ</li>
            </ul>
          </div>

          <div>
            <h4 className="font-serifFancy mb-4 text-lg">About</h4>
            <ul className="space-y-2 text-sm">
              <li>Our Story</li>
              <li>Careers</li>
              <li>Sustainability</li>
            </ul>
          </div>

          <div>
            <h4 className="font-serifFancy mb-4 text-lg">Follow Us</h4>
            <ul className="space-y-2 text-sm">
              <li>Instagram</li>
              <li>Facebook</li>
              <li>Twitter</li>
            </ul>
          </div>
        </div>

        <p className="text-center text-xs mt-10 opacity-80">
          © 2025 Royal Threads. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
