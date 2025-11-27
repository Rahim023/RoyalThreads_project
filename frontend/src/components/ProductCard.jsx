import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCart } from "../pages/CartContext";
import { useWishlist } from "../pages/WishlistContext";
import PopupModal from "./Popupmodal";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [redirectTo, setRedirectTo] = useState("/");

  const productId = product?._id;

  const openPopup = (msg, redirect) => {
    setPopupMessage(msg);
    setRedirectTo(redirect);
    setShowPopup(true);
  };

  const handleNavigation = () => {
    if (!productId) return console.warn("❌ No product ID");
    navigate(`/product/${productId}`);
  };

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
        onClick={handleNavigation}
      >
        <div className="w-full h-64 overflow-hidden">
          <img
            src={product.img}
            alt={product.title}
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        </div>

        <div className="p-4">
          <h3 className="text-lg font-serifFancy font-semibold text-gray-900">
            {product.title}
          </h3>

          <p className="text-gray-600 mt-1 text-sm">{truncatedDesc}</p>

          <div className="mt-2 flex items-center justify-between">
            <span className="font-bold text-gray-900 text-lg">₹{product.price}</span>

            <span className="flex items-center text-yellow-500 font-semibold">
              {Array.from({ length: 5 }, (_, i) => (
                <FaStar
                  key={i}
                  className={i < Math.round(product.rating) ? "text-yellow-400" : "text-gray-300"}
                />
              ))}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNavigation();
            }}
            className="mt-4 w-full py-2 rounded-lg bg-gradient-to-r from-brand-gold to-brand-navy text-white font-semibold hover:from-brand-navy hover:to-brand-gold transition"
          >
            View Product
          </button>
        </div>
      </motion.div>

      {/* SUCCESS POPUP (only for cart/wishlist buttons elsewhere if used) */}
      <PopupModal
        isOpen={showPopup}
        message={popupMessage}
        closeModal={() => setShowPopup(false)}
        redirectTo={redirectTo}
      />
    </>
  );
}
