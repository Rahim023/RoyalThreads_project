// src/pages/Discover.jsx
import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Header from "../components/Header";
import LoginGuard from "../components/LoginGuard";
import axios from "axios";
import { Eye, Heart, ShoppingBag, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
import { useWishlist } from "./WishlistContext";
import { useCurrency } from "../context/CurrencyContext";

export default function Discover() {
  const [products, setProducts] = useState([]);
  const [signatures, setSignatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [heroIndex, setHeroIndex] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const navigate = useNavigate();
  const { addToCart, showLoginModal: cartLoginModal, setShowLoginModal: setCartLoginModal } = useCart();
  const { addToWishlist, wishlist, showLoginModal: wishlistLoginModal, setShowLoginModal: setWishlistLoginModal } = useWishlist();
  const { convertPrice, country } = useCurrency();

  const currencySymbol = country === "Canada" ? "CA$" : country === "USA" ? "US$" : "₹";

  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

  useEffect(() => {
    if (cartLoginModal || wishlistLoginModal) {
      setShowLoginModal(true);
      setCartLoginModal(false);
      setWishlistLoginModal(false);
    }
  }, [cartLoginModal, wishlistLoginModal]);

  // Fetch products + signatures
  useEffect(() => {
    let mounted = true;
    setLoading(true);

    const toArray = (res) => {
      if (!res) return [];
      const payload = res.data !== undefined ? res.data : res;
      if (Array.isArray(payload)) return payload;
      if (payload && Array.isArray(payload.products)) return payload.products;
      if (payload && Array.isArray(payload.data)) return payload.data;
      return [];
    };

    Promise.all([
      axios.get(`${API_BASE}/api/products`).catch((e) => {
        console.warn("Failed to fetch products", e);
        return { data: [] };
      }),
      axios.get(`${API_BASE}/api/signatures`).catch((e) => {
        console.warn("Failed to fetch signatures", e);
        return { data: [] };
      }),
    ])
      .then(([prodRes, sigRes]) => {
        if (!mounted) return;
        setProducts(toArray(prodRes));
        setSignatures(toArray(sigRes));
        setLoading(false);
      })
      .catch((e) => {
        console.error("Discover fetch error", e);
        if (!mounted) return;
        setError("Failed to load collections");
        setLoading(false);
      });

    return () => { mounted = false; };
  }, []);

  // Combined normalized items
  const combined = useMemo(() => {
    const p = (products || []).map((x) => ({
      id: x._id || x.id,
      title: x.title,
      img: x.img || x.images?.[0] || "",
      price: x.price,
      type: "product",
    }));

    const s = (signatures || []).map((x) => ({
      id: x._id || x.id,
      title: x.title,
      img: x.images?.[0] || x.img || "",
      price: x.price || 0,
      slug: x.slug || x._id,
      type: "signature",
    }));

    return [...s, ...p];
  }, [products, signatures]);

  // Hero auto-rotate
  useEffect(() => {
    const t = setInterval(() => {
      setHeroIndex((i) => (i + 1) % Math.max(1, Math.min(6, combined.length)));
    }, 4500);
    return () => clearInterval(t);
  }, [combined.length]);

  const isInWishlist = (id) => wishlist?.some((w) => w.id === id || w._id === id);

  const handleAddToCart = async (item) => {
    const result = await addToCart({
      productId: item.id,
      title: item.title,
      price: item.price || 0,
      img: item.img,
      quantity: 1,
      size: "Standard",
    });
    if (!result && !localStorage.getItem("token")) {
      setShowLoginModal(true);
    }
  };

  const handleAddToWishlist = async (item) => {
    if (isInWishlist(item.id)) return;
    const result = await addToWishlist({ id: item.id, title: item.title, img: item.img });
    if (!result && !localStorage.getItem("token")) {
      setShowLoginModal(true);
    }
  };

  // Premium hero images
  const premiumHeroImages = [
    "https://rt-products.s3.ca-central-1.amazonaws.com/anarkali.jpg",
    "https://rt-products.s3.ca-central-1.amazonaws.com/goldenlenga.webp",
    "https://rt-products.s3.ca-central-1.amazonaws.com/mirror.jpg",
  ];

  // Hero items
  const heroItems = useMemo(() => {
    const dbItems = [];
    if (signatures && signatures.length >= 1) {
      dbItems.push({
        title: signatures[0]?.title || "Signature Collection",
        img: premiumHeroImages[0],
        type: 'signature',
        id: signatures[0]?._id,
        slug: signatures[0]?.slug,
      });
    }
    if (products && products.length >= 1) {
      dbItems.push({
        title: products[0]?.title || "Featured Product",
        img: premiumHeroImages[1],
        type: 'product',
        id: products[0]?._id,
      });
    }
    if (combined.length >= 1) {
      dbItems.push({
        title: combined[0]?.title || "Curated Edit",
        img: premiumHeroImages[2],
        type: combined[0]?.type || 'product',
        id: combined[0]?.id,
        slug: combined[0]?.slug,
      });
    }

    if (dbItems.length === 0) {
      return premiumHeroImages.map((img, idx) => ({
        title: `Collection ${idx + 1}`,
        img,
        type: 'product',
        id: `hero-${idx}`,
      }));
    }

    return dbItems.length > 0 ? dbItems : [{
      title: "Discover",
      img: premiumHeroImages[0],
      type: 'product',
      id: 'default',
    }];
  }, [signatures, products, combined]);

  return (
    <div className="min-h-screen bg-brand-mist font-sansTrend">
      <Header />

      {/* HERO: large premium images */}
      <section className="relative w-full h-[70vh] md:h-[78vh] overflow-hidden">
        {heroItems.length === 0 && (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-gray-500">Loading preview...</div>
          </div>
        )}

        {heroItems.map((h, idx) => (
          <motion.img
            key={h.id || idx}
            src={h.img}
            className="absolute inset-0 w-full h-full object-cover brightness-90"
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: heroIndex === idx ? 1 : 0, scale: heroIndex === idx ? 1 : 1.03 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            onClick={() => {
              if (h.type === "signature") navigate(`/signature/${h.slug || h.id}`);
              else navigate(`/product/${h.id}`);
            }}
            style={{ cursor: "pointer" }}
          />
        ))}

        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>

        <div className="absolute left-6 bottom-12 z-20 max-w-2xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-fancy text-brand-ivory drop-shadow-lg leading-tight"
          >
            Discover the <span className="text-brand-gold">Curation</span>
          </motion.h1>

          <p className="mt-4 text-brand-ivory/90 max-w-xl text-lg font-sansTrend">
            Handpicked signatures and exclusive edits — click to explore pieces in full detail.
          </p>

          <div className="mt-6 flex items-center gap-4">
            <button
              onClick={() => navigate("/signature")}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-brand-gold text-brand-navy font-semibold shadow-md"
            >
              View Signatures <ArrowRight size={16} />
            </button>

            <button
              onClick={() => navigate("/products")}
              className="inline-flex items-center gap-3 px-5 py-3 rounded-full border border-brand-ivory text-brand-ivory hover:bg-brand-ivory/10"
            >
              Browse Collection
            </button>
          </div>
        </div>
      </section>

      <div className="w-full h-[10px] bg-gradient-to-r from-transparent via-brand-gold to-transparent "></div>

      {/* SPOTLIGHT: big image grid from combined items */}
      <section className="px-6 md:px-20 py-12">
        <h2 className="text-4xl md:text-5xl font-fancy text-brand-navy mb-4">Spotlight Editions</h2>
        <p className="text-gray-600 max-w-2xl mb-8">A selection from our latest arrivals and signature releases.</p>

        {loading ? (
          <div className="text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {combined.slice(0, 6).map((item, i) => (
              <motion.div
                key={item.id || i}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-3xl overflow-hidden shadow-xl cursor-pointer"
              >
                <div className="relative h-96">
                  <img
                    src={item.img || "/images/collections/signature/signature-1.jpg"}
                    className="w-full h-full object-cover"
                    onClick={() => item.type === "signature" ? navigate(`/signature/${item.slug || item.id}`) : navigate(`/product/${item.id}`)}
                  />

                  <div className="absolute top-4 right-4 flex gap-3">
                    <button
                      onClick={() => handleAddToWishlist(item)}
                      className={`p-3 rounded-full bg-white/90 shadow-md ${isInWishlist(item.id) ? "text-red-600" : "text-brand-navy"}`}
                    >
                      <Heart size={16} />
                    </button>

                    <button
                      onClick={() => handleAddToCart(item)}
                      className="p-3 rounded-full bg-white/90 shadow-md text-brand-navy"
                    >
                      <ShoppingBag size={16} />
                    </button>
                  </div>
                </div>

                <div className="p-6 flex flex-col gap-4">
                  <h3 className="text-lg font-semibold text-brand-navy line-clamp-2">{item.title}</h3>
                  <p className="text-brand-gold font-bold mt-1">{currencySymbol}{convertPrice(item.price || 0)}</p>

                  <div className="mt-2 flex gap-3">
                    <button
                      onClick={() => item.type === "signature" ? navigate(`/signature/${item.slug || item.id}`) : navigate(`/product/${item.id}`)}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-brand-navy text-brand-ivory text-sm hover:opacity-95 transition"
                    >
                      <Eye size={16} /> View
                    </button>

                    <button
                      onClick={() => handleAddToCart(item)}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-brand-gold text-brand-navy font-semibold shadow-md hover:brightness-95 transition"
                    >
                      <ShoppingBag size={16} /> Add to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* CURATED TILES */}
      <section className="px-6 md:px-20 py-12">
        <h3 className="text-3xl font-fancy text-brand-navy mb-6">Curated Collections</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: "Wedding", path: "/wedding", img: "/images/collections/wedding/wedding-1.jpg" },
            { label: "Men", path: "/men", img: "/images/collections/men/men-1.jpg" },
            { label: "Women", path: "/women", img: "/images/collections/women/women-1.jpg" },
            { label: "Signature", path: "/signature", img: "/images/collections/signature/signature-1.jpg" },
          ].map(({ label, path, img }) => (
            <motion.div key={label} whileHover={{ scale: 1.03 }} className="relative rounded-3xl overflow-hidden shadow-2xl bg-white cursor-pointer">
              <img src={img} className="w-full h-64 object-cover" alt={label} />
              <div className="absolute inset-0 bg-black/25"></div>
              <div className="absolute left-6 bottom-6 text-white">
                <h4 className="text-2xl font-semibold">{label}</h4>
                <button onClick={() => navigate(path)} className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-gold text-brand-navy font-semibold">
                  Explore <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="py-12 text-center text-gray-600 font-sansTrend">
        © 2025 RoyalThreads — Curated with Care
      </footer>

      <LoginGuard
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
}

  