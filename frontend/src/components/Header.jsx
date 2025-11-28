import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaSearch, FaCommentDots, FaUser } from "react-icons/fa"; 
import { useCart } from "../pages/CartContext"; 
import { useWishlist } from "../pages/WishlistContext"; 

// ✅ IMPORT SUPPORT CHAT
import SupportChat from "../components/SupportChat";
import SearchModal from "./searchModal.jsx";

export default function Header() {

  // Chat window toggle
  const [showChat, setShowChat] = useState(false);

  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const itemCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const wishlistCount = wishlist?.length || 0;
  const navigate = useNavigate();

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user")) || null;
  } catch (err) {
    console.warn("Invalid user data in localStorage");
    user = null;
  }

  const [showSearch, setShowSearch] = useState(false);

  const handleWishlist = () => navigate("/wishlist");
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      {/* 🔹 Announcement Bar */}
      <div className="bg-brand-navy text-brand-ivory text-sm text-center py-2 tracking-wide">
        Royal Welcome – Complimentary Shipping on First Order!
      </div>

      {/* 🔹 Main Header */}
      <header className="bg-white shadow-luxe sticky top-0 z-50">
        <div className="flex justify-between items-center px-6 py-4">

          {/* Country Selector */}
          <select className="border px-3 py-1.5 rounded-xl2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold">
            <option>Ship to: Canada</option>
            <option>Ship to: USA</option>
            <option>Ship to: India</option>
          </select>

          {/* Logo */}
          <Link
            to="/"
            className="text-4xl font-sansTrend font-bold text-brand-navy tracking-wide"
            style={{ letterSpacing: "0.06em" }}
          >
            <span className="text-brand-gold">Royal</span>Threads
          </Link>

          {/* Right Icons */}
          <div className="flex items-center gap-5">

            {/* Search */}
            <FaSearch
              className="text-brand-charcoal cursor-pointer hover:text-brand-gold transition"
              size={18}
               onClick={() => setShowSearch(true)}
            />

            {/* Wishlist */}
            <div className="relative cursor-pointer" onClick={handleWishlist}>
              <FaHeart
                className="text-brand-charcoal hover:text-brand-gold transition"
                size={18}
              />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-gold text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {wishlistCount}
                </span>
              )}
            </div>

            {/* Cart */}
            <Link to="/cart" className="relative">
              <FaShoppingCart
                className="text-brand-charcoal cursor-pointer hover:text-brand-gold transition"
                size={18}
              />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-gold text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Chat Icon */}
            <FaCommentDots
              className="text-brand-charcoal cursor-pointer hover:text-brand-gold transition"
              size={18}
              onClick={() => setShowChat(true)}
            />

            {/* Login / Logout */}
            {!user ? (
              <FaUser
                className="text-brand-charcoal cursor-pointer hover:text-brand-gold transition"
                size={18}
                onClick={() => navigate("/login")}
              />
            ) : (
              <button
                onClick={handleLogout}
                className="text-sm font-semibold text-red-600 hover:underline"
              >
                Logout
              </button>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="bg-brand-mist text-brand-charcoal text-sm font-medium">
          <ul className="flex justify-center gap-6 py-2">
            <li><Link to="/women" className="hover:text-brand-gold transition">Women</Link></li>
            <li><Link to="/men" className="hover:text-brand-gold transition">Men</Link></li>
            <li><Link to="/wedding" className="hover:text-brand-gold transition">Wedding</Link></li>
            <li><Link to="/signature" className="hover:text-brand-gold transition">Signature</Link></li>
            <li><Link to="/discover" className="hover:text-brand-gold transition">Discover</Link></li>
            <li><Link to="/orders" className="hover:text-brand-gold transition">My Orders</Link></li>
          </ul>
        </nav>
      </header>

      {/* ✅ CHAT SUPPORT - added EXACTLY here */}
      {showChat && <SupportChat onClose={() => setShowChat(false)} />}
        {showSearch && <SearchModal onClose={() => setShowSearch(false)} />}

    </>
  );
}
