import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaHeart,
  FaShoppingCart,
  FaSearch,
  FaCommentDots,
  FaUser,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { ArrowLeft } from "lucide-react";

import { useCart } from "../pages/CartContext.jsx";
import { useWishlist } from "../pages/WishlistContext";
import { useCurrency } from "../context/CurrencyContext";

import SupportChat from "../components/SupportChat";
import SearchModal from "./SearchModal.jsx";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const [showChat, setShowChat] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
      <div className="bg-brand-navy text-brand-ivory text-xs sm:text-sm text-center py-2 tracking-wide">
        Royal Welcome – Complimentary Shipping on First Order!
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-luxe sticky top-0 z-50">
        {/* Desktop & Tablet Header */}
        <div className="hidden sm:flex items-center justify-between px-4 sm:px-6 py-4">
          {/* Left */}
          <div className="flex items-center gap-3 sm:gap-4">
            {showBack && (
              <button
                onClick={() => navigate(-1)}
                className="text-brand-navy hover:text-brand-gold transition flex items-center gap-1"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <select
              className="border px-2 sm:px-3 py-1.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option value="Canada">Ship to: Canada</option>
              <option value="USA">Ship to: USA</option>
              <option value="India">Ship to: India</option>
            </select>
          </div>

          {/* Logo */}
          <Link
            to="/"
            className="text-3xl sm:text-4xl font-sansTrend font-bold text-brand-navy tracking-wide whitespace-nowrap"
          >
            <span className="text-brand-gold">Royal</span>Threads
          </Link>

          {/* Right */}
          <div className="flex items-center gap-4 sm:gap-5">
            <FaSearch
              size={18}
              className="text-brand-charcoal hover:text-brand-gold cursor-pointer transition"
              onClick={() => setShowSearch(true)}
            />
            <div className="relative cursor-pointer" onClick={() => navigate("/wishlist")}>
              <FaHeart size={18} className="text-brand-charcoal hover:text-brand-gold transition" />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-gold text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {wishlistCount}
                </span>
              )}
            </div>
            <Link to="/cart" className="relative">
              <FaShoppingCart size={18} className="text-brand-charcoal hover:text-brand-gold cursor-pointer transition" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-gold text-white text-xs font-bold px-1 py-0.5 rounded-full">
                  {itemCount}
                </span>
              )}
            </Link>
            <FaCommentDots
              size={18}
              className="text-brand-charcoal hover:text-brand-gold cursor-pointer transition"
              onClick={() => setShowChat(true)}
            />
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

        {/* Mobile Header */}
        <div className="flex sm:hidden items-center justify-between px-4 py-3">
          {/* Hamburger */}
          <button
            className="text-brand-navy text-xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>

          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold text-brand-navy tracking-wide"
          >
            <span className="text-brand-gold">Royal</span>Threads
          </Link>

          {/* Search */}
          <FaSearch
            size={20}
            className="text-brand-charcoal hover:text-brand-gold cursor-pointer transition"
            onClick={() => setShowSearch(true)}
          />
        </div>

        {/* Mobile Drawer */}
        {menuOpen && (
          <div className="sm:hidden bg-brand-mist text-brand-charcoal px-6 py-4 space-y-4">
            {showBack && (
              <button
                onClick={() => navigate(-1)}
                className="text-brand-navy hover:text-brand-gold flex items-center gap-1"
              >
                <ArrowLeft size={18} /> Back
              </button>
            )}

            {/* Navigation */}
            <div className="flex flex-col gap-3 border-b pb-3">
              <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
              <Link to="/women" onClick={() => setMenuOpen(false)}>Women</Link>
              <Link to="/men" onClick={() => setMenuOpen(false)}>Men</Link>
              <Link to="/wedding" onClick={() => setMenuOpen(false)}>Wedding</Link>
              <Link to="/signature" onClick={() => setMenuOpen(false)}>Signature</Link>
              <Link to="/discover" onClick={() => setMenuOpen(false)}>Discover</Link>
              <Link to="/orders" onClick={() => setMenuOpen(false)}>My Orders</Link>
            </div>

            {/* Features */}
            <div className="flex justify-between items-center">
              <Link to="/cart" className="relative flex items-center gap-1">
                <FaShoppingCart size={18} /> Cart
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-brand-gold text-white text-xs font-bold px-1 py-0.5 rounded-full">
                    {itemCount}
                  </span>
                )}
              </Link>

              <div className="relative flex items-center gap-1 cursor-pointer" onClick={() => navigate("/wishlist")}>
                <FaHeart size={18} /> Wishlist
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-brand-gold text-white text-xs font-bold px-1 py-0.5 rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </div>

              <button className="flex items-center gap-1" onClick={() => setShowChat(true)}>
                <FaCommentDots size={18} /> Chat
              </button>
            </div>

            {/* Account & Country */}
            <div className="border-t pt-3 flex flex-col gap-2">
              {!user ? (
                <button onClick={() => { navigate("/login"); setMenuOpen(false); }} className="text-brand-navy font-semibold">
                  Login
                </button>
              ) : (
                <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="text-red-600 font-semibold">
                  Logout
                </button>
              )}
              <select
                className="border px-3 py-1 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option value="Canada">Ship to: Canada</option>
                <option value="USA">Ship to: USA</option>
                <option value="India">Ship to: India</option>
              </select>
            </div>
          </div>
        )}

        {/* Desktop Navigation */}
        <nav className="bg-brand-mist text-brand-charcoal text-sm font-medium hidden sm:block">
          <ul className="flex justify-center gap-6 py-2">
            <li><Link to="/" className="hover:text-brand-gold transition">Home</Link></li>
            <li><Link to="/women" className="hover:text-brand-gold transition">Women</Link></li>
            <li><Link to="/men" className="hover:text-brand-gold transition">Men</Link></li>
            <li><Link to="/wedding" className="hover:text-brand-gold transition">Wedding</Link></li>
            <li><Link to="/signature" className="hover:text-brand-gold transition">Signature</Link></li>
            <li><Link to="/discover" className="hover:text-brand-gold transition">Discover</Link></li>
            <li><Link to="/orders" className="hover:text-brand-gold transition">My Orders</Link></li>
          </ul>
        </nav>
      </header>

      {showChat && <SupportChat onClose={() => setShowChat(false)} />}
      {showSearch && <SearchModal onClose={() => setShowSearch(false)} />}
    </>
  );
}
