import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaHeart,
  FaShoppingCart,
  FaSearch,
  FaCommentDots,
  FaUser,
} from "react-icons/fa";
import { ArrowLeft } from "lucide-react";

import { useCart } from "../pages/CartContext";
import { useWishlist } from "../pages/WishlistContext";
import { useCurrency } from "../context/CurrencyContext";

import SupportChat from "../components/SupportChat";
import SearchModal from "./searchModal.jsx";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const [showChat, setShowChat] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const { country, setCountry } = useCurrency();
  const { cart } = useCart();
  const { wishlist } = useWishlist();

  const itemCount = cart.reduce((sum, i) => sum + (i.quantity || 1), 0);
  const wishlistCount = wishlist?.length || 0;

  const showBack = location.pathname !== "/";

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user")) || null;
  } catch {
    user = null;
  }

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-brand-navy text-brand-ivory text-sm text-center py-2 tracking-wide">
        Royal Welcome – Complimentary Shipping on First Order!
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-luxe sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          
          {/* LEFT SIDE — Back Button + Country Selector */}
          <div className="flex items-center gap-4">

            {/* BACK BUTTON (ONLY WHEN NOT ON HOME PAGE) */}
            {showBack && (
              <button
                onClick={() => navigate(-1)}
                className="text-brand-navy hover:text-brand-gold transition flex items-center gap-1"
              >
                <ArrowLeft size={20} />
              </button>
            )}

            {/* COUNTRY SELECTOR */}
            <select
              className="border px-3 py-1.5 rounded-xl text-sm 
                       focus:outline-none focus:ring-1 focus:ring-brand-gold"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option value="Canada">Ship to: Canada</option>
              <option value="USA">Ship to: USA</option>
              <option value="India">Ship to: India</option>
            </select>
          </div>

          {/* CENTER LOGO */}
          <Link
            to="/"
            className="text-4xl font-sansTrend font-bold text-brand-navy tracking-wide"
          >
            <span className="text-brand-gold">Royal</span>Threads
          </Link>

          {/* RIGHT SIDE ICONS */}
          <div className="flex items-center gap-5">

            {/* SEARCH */}
            <FaSearch
              size={18}
              className="text-brand-charcoal hover:text-brand-gold cursor-pointer transition"
              onClick={() => setShowSearch(true)}
            />

            {/* WISHLIST */}
            <div
              className="relative cursor-pointer"
              onClick={() => navigate("/wishlist")}
            >
              <FaHeart
                size={18}
                className="text-brand-charcoal hover:text-brand-gold transition"
              />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-gold text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {wishlistCount}
                </span>
              )}
            </div>

            {/* CART */}
            <Link to="/cart" className="relative">
              <FaShoppingCart
                size={18}
                className="text-brand-charcoal hover:text-brand-gold cursor-pointer transition"
              />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-gold text-white text-xs font-bold px-1 py-0.5 rounded-full">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* CHAT */}
            <FaCommentDots
              size={18}
              className="text-brand-charcoal hover:text-brand-gold cursor-pointer transition"
              onClick={() => setShowChat(true)}
            />

            {/* LOGIN / LOGOUT */}
            {!user ? (
              <FaUser
                size={18}
                className="text-brand-charcoal cursor-pointer hover:text-brand-gold transition"
                onClick={() => navigate("/login")}
              />
            ) : (
              <button
                className="text-sm text-red-600 font-semibold hover:underline"
                onClick={handleLogout}
              >
                Logout
              </button>
            )}
          </div>
        </div>

        {/* NAVIGATION MENU */}
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

      {/* Chat & Search Modals */}
      {showChat && <SupportChat onClose={() => setShowChat(false)} />}
      {showSearch && <SearchModal onClose={() => setShowSearch(false)} />}
    </>
  );
}
