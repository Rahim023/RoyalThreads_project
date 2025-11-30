import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import PopupModal from "./Popupmodal";
import { useCart } from "../pages/CartContext";
import { useWishlist } from "../pages/WishlistContext";
import { useNavigate } from "react-router-dom";
import { useCurrency } from "../context/CurrencyContext";

export default function ProductCardMen({ product, minimal = false }) {
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [redirectTo, setRedirectTo] = useState("/");
  const [showFullDesc, setShowFullDesc] = useState(false);

  const productId = product?._id || product.id;

  // ⭐ Currency hook
  const { country, convertPrice } = useCurrency();

  const currencySymbol =
    country === "Canada" ? "CA$" :
    country === "USA" ? "US$" :
    "₹";

  const openPopup = (msg, redirect) => {
    setPopupMessage(msg);
    setRedirectTo(redirect);
    setShowPopup(true);
  };

  const truncatedDesc =
    product.description && product.description.length > 80
      ? product.description.substring(0, 80) + "..."
      : product.description;

  const handleCardClick = () => {
    if (!productId) return console.error("No product ID:", product);
    navigate(`/product/${productId}`);
  };

  return (
    <>
      {/* CARD */}
      <motion.div
        whileHover={{ scale: 1.03, boxShadow: "0px 0px 25px #facc15" }}
        className="bg-white rounded-xl2 overflow-hidden cursor-pointer border border-brand-navy hover:shadow-[0_0_40px_15px_rgba(252,204,21,0.5)] transition relative"
        onClick={handleCardClick}
      >
        <div className="w-full h-64 overflow-hidden border border-brand-navy shadow-lg">
          <img
            src={product.img}
            alt={product.title}
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        </div>

        <div className="p-4">
          <h3 className="text-lg font-heading font-semibold text-gray-900">
            {product.title}
          </h3>

          {!minimal && (
            <p className="text-gray-600 mt-1 font-body text-sm">
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
          )}

          <div className="mt-2 flex items-center justify-between">
            {/* ⭐ Converted price with correct symbol */}
            <span className="font-bold text-gray-900 text-lg">
              {currencySymbol} {convertPrice(product.price)}
            </span>

            <span className="flex items-center text-yellow-500 font-semibold">
              {Array.from({ length: 5 }, (_, i) => (
                <FaStar
                  key={i}
                  className={
                    i < Math.round(product.rating || 0)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }
                />
              ))}
            </span>
          </div>

          {!minimal && (
            <button
              className="mt-4 w-full py-2 rounded-lg bg-gradient-to-r from-brand-gold to-brand-navy text-white font-semibold hover:from-brand-navy hover:to-brand-gold transition"
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
            >
              View Product
            </button>
          )}
        </div>
      </motion.div>

      {/* Old modal kept, in case you still use it somewhere */}
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

            <h2 className="text-2xl font-heading font-bold text-gray-900 mb-2">
              {product.title}
            </h2>

            <p className="text-gray-700 mb-2 font-body">{product.description}</p>

            <p className="text-gray-500 mb-2 font-body">
              Category: {product.category}
            </p>
            <p className="text-gray-500 mb-2 font-body">
              Brand: {product.brand}
            </p>
            <p className="text-gray-500 mb-2 font-body">
              Stock: {product.stock}
            </p>

            <div className="flex items-center mb-4">
              <span className="flex items-center text-yellow-500">
                {Array.from({ length: 5 }, (_, i) => (
                  <FaStar
                    key={i}
                    className={
                      i < Math.round(product.rating || 0)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }
                  />
                ))}
              </span>
              <span className="ml-2 text-gray-600 font-body">
                {product.rating}/5
              </span>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  addToCart({ ...product, id: productId });
                  openPopup("Item added to Cart!", "/cart");
                }}
                className="flex-1 py-2 rounded-lg bg-brand-navy text-white font-semibold hover:bg-brand-gold hover:text-brand-charcoal transition"
              >
                Add to Cart
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToWishlist({ ...product, id: productId });
                  openPopup("Item added to Wishlist!", "/wishlist");
                }}
                className="py-2 px-4 rounded-lg border border-brand-gold text-brand-navy hover:bg-brand-gold hover:text-white transition"
              >
                Wishlist
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <PopupModal
        isOpen={showPopup}
        message={popupMessage}
        closeModal={() => setShowPopup(false)}
        redirectTo={redirectTo}
      />
    </>
  );
}
 