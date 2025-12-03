// src/pages/Wedding.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Header from "../components/Header";
import { useCart } from "./CartContext";
import { useWishlist } from "./WishlistContext";
import { useCurrency } from "../context/CurrencyContext";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Wedding() {
  const [weddingProducts, setWeddingProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [currentHero, setCurrentHero] = useState(0);

  const BASE_URL = "http://localhost:5000/api";
  const exploreRef = useRef(null);
  const navigate = useNavigate();

  const { addToCart } = useCart();
  const { wishlist, addToWishlist } = useWishlist();
  const { convertPrice, country } = useCurrency();

  const currencySymbol =
    country === "Canada" ? "CA$" : country === "USA" ? "US$" : "₹";

  const heroImages = [
    "https://amzn-s3-cap-bucket.s3.us-east-2.amazonaws.com/wedding+homepage/wed_1.jpg",
    "https://amzn-s3-cap-bucket.s3.us-east-2.amazonaws.com/wedding+homepage/wedding_2.webp",
    "https://amzn-s3-cap-bucket.s3.us-east-2.amazonaws.com/wedding+homepage/wedding_4.jpg",
  ];

  // Hero auto-rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroImages.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Fetch wedding products
  useEffect(() => {
    const fetchWedding = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/products`);
        const onlyWedding = res.data.filter((p) => p.Wedding === true);
        setWeddingProducts(onlyWedding);
        setFilteredProducts(onlyWedding);
      } catch (err) {
        console.error("Error fetching wedding products:", err);
      }
    };
    fetchWedding();
  }, []);

  // Filter logic
  const applyFilter = (query = "", category = "All") => {
    let list = weddingProducts.filter(
      (p) =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.description?.toLowerCase().includes(query.toLowerCase())
    );

    if (category !== "All") {
      const catLower = category.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(catLower) ||
          p.description?.toLowerCase().includes(catLower) ||
          p.category?.toLowerCase().includes(catLower)
      );
    }

    setFilteredProducts(list);
  };

  const handleSearchSubmit = () => {
    applyFilter(searchQuery, categoryFilter);
    exploreRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const categories = [
    "All",
    "Lehenga",
    "Sherwani",
    "Saree",
    "Jewellery",
    "Groom",
    "Bridal",
  ];

  const isInWishlist = (id) =>
    wishlist?.some((w) => w.id === id || w._id === id || w.productId === id);

  // Add to cart
  const handleAddToCart = (product) => {
    addToCart({
      id: product._id,
      productId: product._id,
      title: product.title,
      price: product.price,
      img: product.img,
      quantity: 1,
      size: "Standard",
    });
  };

  // Add to wishlist
  const handleAddToWishlist = (product) => {
    if (isInWishlist(product._id)) return;
    addToWishlist({ id: product._id, ...product });
  };

  // Featured products
  const featuredWedding = useMemo(() => {
    const trending = weddingProducts.filter((p) => p.trending);
    return (trending.length ? trending : weddingProducts).slice(0, 4);
  }, [weddingProducts]);

  return (
    <div className="min-h-screen bg-brand-mist font-sansTrend">
      <Header />

      {/* ================= HERO ================= */}
      <div className="relative w-full h-[65vh] md:h-[80vh] overflow-hidden">
        {heroImages.map((img, idx) => (
          <motion.img
            key={idx}
            src={img}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: currentHero === idx ? 1 : 0 }}
            transition={{ duration: 1.4, ease: "easeIn" }}
          />
        ))}

        {/* Floating text animation */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3 }}
          className="absolute inset-0 bg-black/45 flex flex-col items-center justify-center"
        >
          <motion.h1
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1 }}
            className="text-white text-5xl md:text-7xl font-bold tracking-wide drop-shadow-xl"
          >
            Wedding Couture Collection
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="mt-4 text-xl md:text-2xl text-gray-200 italic"
          >
            Luxury. Heritage. Elegance. ✨
          </motion.p>

          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.97 }}
            onClick={() =>
              exploreRef.current?.scrollIntoView({ behavior: "smooth" })
            }
            className="mt-8 px-10 py-3 rounded-full bg-brand-gold text-brand-navy font-semibold shadow-lg 
              hover:bg-brand-ivory hover:text-brand-navy transition-all text-lg"
          >
            Explore Collection
          </motion.button>
        </motion.div>
      </div>

      {/* ================= SEARCH SECTION ================= */}
      <section className="px-6 md:px-20 py-14 flex flex-col items-center gap-6">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex w-full md:w-2/3 gap-3"
        >
          <input
            type="text"
            placeholder="Search lehengas, sherwanis, sarees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
            className="flex-1 px-5 py-3 rounded-full border border-gray-300 focus:ring-2 
              focus:ring-brand-gold bg-white/95 text-lg shadow"
          />
          <button
            onClick={handleSearchSubmit}
            className="px-6 py-3 rounded-full bg-brand-navy text-brand-ivory text-lg 
              font-semibold shadow hover:bg-brand-gold hover:text-brand-navy transition"
          >
            Search
          </button>
        </motion.div>

        {/* filters */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="flex flex-wrap justify-center gap-3"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategoryFilter(cat);
                applyFilter(searchQuery, cat);
                exploreRef.current?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`px-4 py-2 rounded-full font-semibold border ${
                categoryFilter === cat
                  ? "bg-brand-navy text-brand-ivory border-brand-navy"
                  : "border-gray-300 text-gray-700 hover:bg-brand-mist"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>
      </section>

      {/* ================= FEATURED STACKED ================= */}
      {featuredWedding.length > 0 && (
        <section className="py-10 px-6 md:px-20">
          <motion.h2
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center text-5xl font-bold text-brand-navy"
          >
            Featured Wedding Styles
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-center text-lg text-brand-charcoal/80 mb-10"
          >
            Curated masterpieces for your special moments ✨
          </motion.p>

          <div className="relative flex items-center justify-center h-[420px]">
            <div className="flex space-x-[-40px] md:space-x-[-60px]">
              {featuredWedding.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.6 }}
                  whileHover={{
                    scale: 1.08,
                    rotate: index % 2 === 0 ? 2 : -2,
                  }}
                  className="w-[230px] md:w-[260px] h-[340px] rounded-3xl bg-white 
                    shadow-xl overflow-hidden cursor-pointer border border-brand-gold/50"
                  onClick={() => navigate(`/product/${item._id}`)}
                >
                  <img
                    src={item.img}
                    className="w-full h-[240px] object-cover"
                  />
                  <div className="p-3 text-center">
                    <h3 className="font-semibold text-brand-navy">{item.title}</h3>
                    <p className="text-brand-gold font-bold mt-1">
                      {currencySymbol}
                      {convertPrice(item.price)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= ALL WEDDING PRODUCTS ================= */}
      <section ref={exploreRef} className="py-16 px-6 md:px-20">
        <motion.h2
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center text-5xl font-bold text-brand-navy mb-10"
        >
          Explore Wedding Collection
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-10"
        >
          {filteredProducts.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.07, duration: 0.6 }}
              className="group bg-white rounded-3xl shadow-md border border-gray-200 
                hover:border-brand-gold/70 hover:shadow-xl overflow-hidden flex flex-col"
            >
              <div className="relative overflow-hidden">
                <motion.img
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.5 }}
                  src={item.img}
                  className="w-full h-72 object-cover"
                />

                {/* Wishlist Icon */}
                <button
                  onClick={() => handleAddToWishlist(item)}
                  className={`absolute top-3 right-3 p-2 rounded-full bg-white/90 shadow-md 
                    transition ${
                      isInWishlist(item._id)
                        ? "text-red-600"
                        : "text-brand-navy hover:text-brand-gold"
                    }`}
                >
                  <Heart size={18} />
                </button>

                {/* View Btn */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => navigate(`/product/${item._id}`)}
                  className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-2 
                    rounded-full bg-brand-navy text-white text-xs md:text-sm 
                    opacity-0 group-hover:opacity-100 transition-all shadow-md"
                >
                  <Eye size={16} />
                </motion.button>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg font-semibold text-brand-navy line-clamp-2">
                  {item.title}
                </h3>

                <p className="text-brand-gold font-bold mt-3 text-xl">
                  {currencySymbol}
                  {convertPrice(item.price)}
                </p>

                <div className="mt-4 flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="flex-1 bg-brand-gold text-brand-navy py-2 rounded-full font-semibold hover:bg-brand-navy hover:text-white transition shadow"
                    onClick={() => handleAddToCart(item)}
                  >
                    <ShoppingBag size={16} className="inline-block mr-2" />
                    Add to Cart
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="px-4 py-2 rounded-full border border-brand-gold text-brand-navy hover:bg-brand-gold hover:text-white transition"
                    onClick={() => navigate(`/product/${item._id}`)}
                  >
                    View
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="bg-brand-navy text-brand-ivory py-8 text-center mt-16">
        <p className="text-sm">© 2025 RoyalThreads. All rights reserved.</p>
      </footer>
    </div>
  );
}
