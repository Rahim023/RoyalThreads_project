import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 🔹 Context Providers
import { CartProvider } from "./pages/CartContext";
import { WishlistProvider } from "./pages/WishlistContext";

// 🔹 Styles
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// 🔹 Pages
import ProductPage from "./pages/Productpage";
import SignatureSeries from "./pages/Signature";
import SignatureProductPage from "./pages/SignatureProductPage";
import Home from "./pages/Home";
import Men from "./pages/Men";
import Women from "./pages/Women";
import Wedding from "./pages/Wedding";
import Signature from "./pages/Signature";
import Discover from "./pages/Discover";
import WomenCasual from "./pages/WomenCasual";
import WomenBridal from "./pages/WomenBridal";
import WomenSarees from "./pages/WomenSarees";
import WomenJewelry from "./pages/WomenJewelry";
import WomenEvening from "./pages/WomenEvening";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderStatus from "./pages/OrderStatus";
import Wishlist from "./pages/Wishlist";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CategoryPage from "./pages/categoryPage";
import Accessories from "./pages/Accessories";
import Jewelry from "./pages/Jewelry";

export default function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <Router>
          <Routes>
            {/* 🔹 Home */}
            <Route path="/" element={<Home />} />

            {/* 🔹 Men & Women */}
            <Route path="/men" element={<Men />} />
            <Route path="/women" element={<Women />} />

            {/* 🔹 Main Categories */}
            <Route path="/wedding" element={<Wedding />} />
            <Route path="/signature" element={<Signature />} />
            <Route path="/discover" element={<Discover />} />

            {/* 🔹 Women Subcategories */}
            <Route path="/women/casual" element={<WomenCasual />} />
            <Route path="/women/bridal" element={<WomenBridal />} />
            <Route path="/women/sarees" element={<WomenSarees />} />
            <Route path="/women/jewelry" element={<WomenJewelry />} />
            <Route path="/women/evening" element={<WomenEvening />} />
            <Route path="/product/:id" element={<ProductPage />} />


            {/* 🔹 Cart & Orders */}
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-status" element={<OrderStatus />} />
            <Route path="/orders" element={<OrderStatus />} />

            {/* 🔹 Wishlist */}
            <Route path="/wishlist" element={<Wishlist />} />
    
            {/* 🔹 Authentication */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* 🔹 Category & Subcategory Pages */}
            <Route path="/category/:name" element={<CategoryPage />} />
            <Route path="/accessories" element={<Accessories />} />
            <Route path="/jewelry" element={<Jewelry />} />
            {/* 🔹 Signature Series */}
            <Route path="/signature-series" element={<SignatureSeries />} />
            <Route path="/signature/:slug" element={<SignatureProductPage />} />

            {/* 🔹 Catch-all 404 */}
            <Route
              path="*"
              element={
                <div className="flex items-center justify-center h-screen text-center">
                  <h1 className="text-3xl font-bold text-red-600">
                    404 – Page Not Found
                  </h1>
                </div>
              }
            />
          </Routes>
        </Router>
      </WishlistProvider>
    </CartProvider>
  );
}
