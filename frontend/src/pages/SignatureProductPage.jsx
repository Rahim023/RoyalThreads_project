// src/pages/SignatureProductPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../components/Header";
import PopupModal from "../components/Popupmodal";
import { useCart } from "./CartContext";
import { useWishlist } from "./WishlistContext";
import { ArrowLeft } from "lucide-react";

export default function SignatureProductPage() {
  const { slug } = useParams(); // use slug instead of id
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [qty, setQty] = useState(1);

  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [redirectTo, setRedirectTo] = useState("/");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`http://localhost:5000/api/signatures/slug/${slug}`);
        if (!res.ok) {
          console.error("Product fetch failed", res.status);
          return;
        }
        const data = await res.json();
        setProduct(data);
        setMainImage(data.images?.[0] || "");
        setSelectedSize(data.sizes?.[0] || "");
        setSelectedColor(data.colors?.[0] || "");
      } catch (err) {
        console.error("Failed to load product", err);
      }
    }
    load();
  }, [slug]);

  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading product...
      </div>
    );

  const openPopup = (msg, redirect) => {
    setPopupMessage(msg);
    setRedirectTo(redirect);
    setShowPopup(true);
  };

  const handleAddToCart = () => {
    const item = {
      id: product._id || product.id,
      sku: product.sku,
      title: product.title,
      price: product.price,
      currency: product.currency,
      image: mainImage,
      qty,
      size: selectedSize,
      color: selectedColor,
    };
    addToCart(item);
    openPopup("Item added to cart", "/cart");
  };

  const handleAddToWishlist = () => {
    const item = {
      id: product._id || product.id,
      sku: product.sku,
      title: product.title,
      price: product.price,
      image: mainImage,
    };
    addToWishlist(item);
    openPopup("Item added to wishlist", "/wishlist");
  };

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
        {/* IMAGES */}
        <div>
          <motion.img
            key={mainImage}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45 }}
            src={mainImage || "https://picsum.photos/900/900?random=11"}
            alt={product.title}
            className="w-full h-[600px] object-cover rounded-2xl shadow-lg"
          />

          <div className="flex gap-3 mt-4">
            {product.images?.map((img, i) => (
              <button
                key={i}
                onClick={() => setMainImage(img)}
                className={`h-20 w-20 rounded-lg overflow-hidden border ${
                  mainImage === img ? "border-brand-gold" : "border-transparent"
                }`}
              >
                <img src={img} alt={`${product.title}-${i}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* DETAILS */}
        <div className="space-y-5">
          <h1 className="text-4xl font-fancy text-brand-navy">{product.title}</h1>
          <div className="flex items-center gap-4">
            <div className="text-2xl font-semibold text-brand-gold">
              ${product.price} {product.currency}
            </div>
            <div className="text-sm text-gray-500">• {product.signatureBadge}</div>
          </div>

          <p className="text-gray-700 leading-relaxed">{product.description}</p>

          <div className="bg-white rounded-xl p-4 shadow">
            <h4 className="font-medium text-brand-navy">Craft</h4>
            <p className="text-sm text-gray-600 mt-1">{product.craftDetails}</p>
            <div className="mt-2 text-sm text-gray-500">Artisan: {product.artisanName}</div>
          </div>

          {/* OPTIONS */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600">Size</div>
              <div className="mt-2 flex gap-2">
                {product.sizes?.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-3 py-2 rounded-full border ${
                      selectedSize === s ? "bg-brand-navy text-white" : "bg-white text-gray-700"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-600">Color</div>
              <div className="mt-2 flex gap-2 items-center">
                {product.colors?.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`px-3 py-2 rounded-full border ${
                      selectedColor === c ? "bg-brand-navy text-white" : "bg-white text-gray-700"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-sm text-gray-600">
              Stock: <span className="font-medium text-gray-800">{product.stock}</span>
            </div>
            <div className="text-sm text-gray-600">
              Rating: <span className="font-medium text-gray-800">{product.rating}</span>
            </div>
            <div className="text-sm text-gray-600">
              Reviews: <span className="font-medium text-gray-800">{product.reviewsCount}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
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

            <button
              onClick={handleAddToCart}
              className="ml-4 px-6 py-3 rounded-full bg-brand-navy text-brand-ivory font-semibold hover:bg-brand-gold hover:text-brand-navy transition"
            >
              Add to Cart
            </button>

            <button
              onClick={handleAddToWishlist}
              className="px-4 py-3 rounded-full border border-brand-gold text-brand-navy hover:bg-brand-gold hover:text-white transition"
            >
              Add to Wishlist
            </button>
          </div>

          <div className="text-sm text-gray-500 mt-4 space-y-1">
            <div>SKU: {product.sku}</div>
            <div>Material: {product.materials}</div>
            <div>Care: {product.care}</div>
            <div>
              Dimensions: {product.dimensionsCm?.length} x {product.dimensionsCm?.width} cm
            </div>
            <div>Release Year: {product.releaseYear}</div>
          </div>
        </div>
      </section>

      {/* POPUP modal */}
      <PopupModal
        isOpen={showPopup}
        message={popupMessage}
        closeModal={() => setShowPopup(false)}
        redirectTo={redirectTo}
      />

      <footer className="py-12 text-center text-gray-600">
        © 2025 Royal Threads — Signature Series
      </footer>
    </div>
  );
}
