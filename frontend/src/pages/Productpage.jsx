import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../components/Header";
import PopupModal from "../components/Popupmodal";
import { useCart } from "./CartContext";
import { useWishlist } from "./WishlistContext";
import { ArrowLeft } from "lucide-react";

export default function ProductPage() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [qty, setQty] = useState(1);

  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [redirectTo, setRedirectTo] = useState("/");

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        if (!res.ok) return console.error("Product fetch failed:", res.status);

        const data = await res.json();
        setProduct(data);

        setMainImage(data.img);
        setSelectedSize(data.sizes?.[0] || "");
      } catch (err) {
        console.error("Error loading product", err);
      }
    }
    loadProduct();
  }, [id]);

  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  const openPopup = (msg, redirect) => {
    setPopupMessage(msg);
    setRedirectTo(redirect);
    setShowPopup(true);
  };

  const handleAddToCart = () => {
    addToCart({
      id: product._id,
      title: product.title,
      price: product.price,
      image: product.img,
      size: selectedSize,
      qty,
    });
    openPopup("Item added to cart", "/cart");
  };

  const handleAddToWishlist = () => {
    addToWishlist({
      id: product._id,
      title: product.title,
      price: product.price,
      image: product.img,
    });
    openPopup("Item added to wishlist", "/wishlist");
  };

  const handleCheckout = () => navigate("/checkout");

  return (
    <div className="min-h-screen bg-brand-mist font-inter">
      <Header />

      <div className="px-6 md:px-20 py-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-brand-navy hover:text-brand-gold"
        >
          <ArrowLeft /> Back
        </button>
      </div>

      <section className="max-w-7xl mx-auto px-6 md:px-20 grid grid-cols-1 md:grid-cols-2 gap-10 py-8">
        
        {/* IMAGE */}
        <div>
          <motion.img
            key={mainImage}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45 }}
            src={mainImage}
            alt={product.title}
            className="w-full h-[600px] object-cover rounded-2xl shadow-lg"
          />
        </div>

        {/* DETAILS */}
        <div className="space-y-6">

          <h1 className="text-4xl font-fancy text-brand-navy">{product.title}</h1>

          <div className="text-2xl font-semibold text-brand-gold">
            ${product.price}
          </div>

          <p className="text-gray-700 leading-relaxed">{product.description}</p>

          {/* STOCK + RATING */}
          <div className="flex items-center gap-6">
            <div className="text-sm text-gray-600">
              Stock: <span className="font-medium">{product.stock}</span>
            </div>
            <div className="text-sm text-gray-600">
              Rating: <span className="font-medium">{product.rating}</span>
            </div>
            <div className="text-sm text-gray-600">
              Reviews: <span className="font-medium">{product.reviewsCount || 0}</span>
            </div>
          </div>

          {/* SIZE */}
          <div>
            <div className="text-sm text-gray-600">Size</div>
            <div className="mt-2 flex gap-2">
              {(product.sizes || ["S", "M", "L"]).map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`px-3 py-2 rounded-full border ${
                    selectedSize === s
                      ? "bg-brand-navy text-white"
                      : "bg-white text-gray-700"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* QUANTITY */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-3 py-2 rounded bg-white"
              >
                -
              </button>
              <div className="px-4 py-2 bg-white rounded">{qty}</div>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="px-3 py-2 rounded bg-white"
              >
                +
              </button>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleAddToCart}
              className="px-6 py-3 rounded-full bg-brand-navy text-brand-ivory font-semibold hover:bg-brand-gold hover:text-brand-navy transition"
            >
              Add to Cart
            </button>

            <button
              onClick={handleAddToWishlist}
              className="px-4 py-3 rounded-full border border-brand-gold text-brand-navy hover:bg-brand-gold hover:text-white transition"
            >
              Add to Wishlist
            </button>

            <button
              onClick={handleCheckout}
              className="px-6 py-3 rounded-full bg-brand-gold text-brand-navy font-semibold hover:bg-brand-navy hover:text-white transition"
            >
              Proceed to Checkout
            </button>
          </div>

        </div>
      </section>

      <PopupModal
        isOpen={showPopup}
        message={popupMessage}
        closeModal={() => setShowPopup(false)}
        redirectTo={redirectTo}
      />

      <footer className="py-12 text-center text-gray-600">
        © 2025 Royal Threads
      </footer>
    </div>
  );
}
