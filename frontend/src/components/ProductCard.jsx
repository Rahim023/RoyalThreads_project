// src/components/ProductCard.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import { useCart } from "../pages/CartContext";
import { useWishlist } from "../pages/WishlistContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  const [showModal, setShowModal] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);

  // IMPORTANT: Always ensure we have an ID
  const productId = product?.id || product?._id;

  // Debug log
  React.useEffect(() => {
    if (!productId) {
      console.warn("⚠️ ProductCard received product without ID:", product);
    } else {
      console.log("✅ ProductCard has productId:", productId, "Product:", product);
    }
  }, [productId, product]);

  const truncatedDesc =
    product.description && product.description.length > 80
      ? product.description.substring(0, 80) + "..."
      : product.description;

  return (
    <>
      {/* PRODUCT CARD */}
      <motion.div
        whileHover={{ scale: 1.03, boxShadow: "0px 0px 25px #1e3a8a" }}
        className="bg-white rounded-xl overflow-hidden cursor-pointer border border-transparent hover:border-brand-navy transition relative"
        onClick={() => setShowModal(true)}
      >
        {/* IMAGE */}
        <div className="w-full h-64 overflow-hidden">
          <img
            src={product.img}
            alt={product.title}
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        </div>

        {/* DETAILS */}
        <div className="p-4">
          <h3 className="text-lg font-serifFancy font-semibold text-gray-900">
            {product.title}
          </h3>

          <p className="text-gray-600 mt-1 text-sm">
            {showFullDesc ? product.description : truncatedDesc}{" "}
            {product.description && product.description.length > 80 && (
              <button
                className="text-blue-500 ml-1 text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFullDesc(!showFullDesc);
                }}
              >
                {showFullDesc ? "Show less" : "Show more"}
              </button>
            )}
          </p>

          <div className="mt-2 flex items-center justify-between">
            <span className="font-bold text-gray-900 text-lg">
              ₹{product.price}
            </span>

            {/* RATING */}
            <span className="flex items-center text-yellow-500 font-semibold">
              {Array.from({ length: 5 }, (_, i) => (
                <FaStar
                  key={i}
                  className={
                    i < Math.round(product.rating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }
                />
              ))}
            </span>
          </div>

          <button className="mt-4 w-full py-2 rounded-lg bg-gradient-to-r from-brand-gold to-brand-navy text-white font-semibold hover:from-brand-navy hover:to-brand-gold transition">
            View Product
          </button>
        </div>
      </motion.div>

      {/* MODAL */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 max-w-lg w-full relative"
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 font-bold text-xl"
            >
              &times;
            </button>

            <img
              src={product.img}
              alt={product.title}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />

            <h2 className="text-2xl font-serifFancy font-bold text-gray-900 mb-2">
              {product.title}
            </h2>

            <p className="text-gray-700 mb-2">{product.description}</p>
            <p className="text-gray-500 mb-2">Category: {product.category}</p>
            <p className="text-gray-500 mb-2">Brand: {product.brand}</p>
            <p className="text-gray-500 mb-2">Stock: {product.stock}</p>

            {/* Rating */}
            <div className="flex items-center mb-4">
              <span className="flex items-center text-yellow-500">
                {Array.from({ length: 5 }, (_, i) => (
                  <FaStar
                    key={i}
                    className={
                      i < Math.round(product.rating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }
                  />
                ))}
              </span>
              <span className="ml-2 text-gray-600">{product.rating}/5</span>
            </div>

            {/* BUTTONS */}
            <div className="flex gap-4">
              <button
                onClick={() => {
                  console.log("🛒 Add to cart clicked. productId:", productId, "Product:", product);
                  if (!productId) {
                    alert("❌ Product ID is missing! Cannot add to cart.");
                    return;
                  }
                  addToCart({ ...product, id: productId });
                }}
                className="flex-1 py-2 rounded-lg bg-brand-navy text-white font-semibold hover:bg-brand-gold hover:text-brand-charcoal transition"
              >
                Add to Cart
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("❤️ Add to wishlist clicked. productId:", productId, "Product:", product);
                  if (!productId) {
                    alert("❌ Product ID is missing! Cannot add to wishlist.");
                    return;
                  }
                  addToWishlist({ ...product, id: productId });
                }}
                className="py-2 px-4 rounded-lg border border-brand-gold text-brand-navy hover:bg-brand-gold hover:text-white transition"
              >
                Wishlist
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
