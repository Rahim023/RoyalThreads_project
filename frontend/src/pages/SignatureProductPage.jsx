import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../components/Header";
import PopupModal from "../components/Popupmodal";
import { useCart } from "./CartContext";
import { useWishlist } from "./WishlistContext";
import { ArrowLeft } from "lucide-react";

export default function SignatureProductPage() {
  const { slug } = useParams();
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
          alert("Product not found");
          return;
        }

        const data = await res.json();

        setProduct(data);
        setMainImage(data.images?.[0] || "");
        setSelectedSize(data.sizes?.[0] || "");
        setSelectedColor(data.colors?.[0] || "");
      } catch (err) {
        console.error("Signature fetch failed:", err);
      }
    }

    load();
  }, [slug]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading product...
      </div>
    );
  }

  const openPopup = (msg, redirect) => {
    setPopupMessage(msg);
    setRedirectTo(redirect);
    setShowPopup(true);
  };

  const handleAddToCart = () => {
    const id = product._id?.toString() || product.id?.toString();

    if (!id) {
      alert("Item cannot be added. Missing product ID.");
      return;
    }

    addToCart({
      id,
      sku: product.sku,
      title: product.title,
      price: product.price,
      currency: product.currency,
      image: mainImage,
      qty,
      size: selectedSize,
      color: selectedColor,
    });

    openPopup("Item added to cart", "/cart");
  };

  const handleAddToWishlist = () => {
    addToWishlist({
      id: product._id,
      title: product.title,
      price: product.price,
      image: mainImage,
    });

    openPopup("Item added to wishlist", "/wishlist");
  };

  return (
    <div className="min-h-screen bg-brand-mist font-inter">
      <Header />

      {/* BACK BUTTON */}
      <div className="px-6 md:px-20 py-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-brand-navy hover:text-brand-gold"
        >
          <ArrowLeft /> Back
        </button>
      </div>

      <section className="max-w-7xl mx-auto px-6 md:px-20 grid grid-cols-1 md:grid-cols-2 gap-10 py-8">

        {/* LEFT: IMAGES */}
        <div>
          <motion.img
            key={mainImage}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45 }}
            src={mainImage}
            alt={product.title}
            className="w-full h-[600px] object-cover rounded-2xl shadow-xl"
          />

          {/* THUMBNAILS */}
          <div className="flex gap-3 mt-4">
            {product.images?.map((img, i) => (
              <button
                key={i}
                onClick={() => setMainImage(img)}
                className={`h-20 w-20 rounded-lg overflow-hidden border ${
                  mainImage === img ? "border-brand-gold" : "border-transparent"
                }`}
              >
                <img src={img} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: DETAILS */}
        <div className="space-y-5">
          <h1 className="text-4xl font-fancy text-brand-navy">
            {product.title}
          </h1>

          <div className="flex items-center gap-4">
            <div className="text-2xl font-semibold text-brand-gold">
              ${product.price} {product.currency}
            </div>
            <div className="text-sm text-gray-500">• {product.signatureBadge}</div>
          </div>

          <p className="text-gray-700 leading-relaxed">{product.description}</p>

          {/* CRAFT DETAILS CARD */}
          <div className="bg-white rounded-xl p-5 shadow-md">
            <h3 className="font-semibold text-brand-navy">Craftsmanship</h3>
            <p className="text-sm text-gray-600 mt-1">{product.craftDetails}</p>

            <p className="text-sm mt-2 text-gray-500">Artisan: {product.artisanName}</p>
          </div>

          {/* OPTIONS */}
          <div className="grid grid-cols-2 gap-4">
            {/* SIZE */}
            <div>
              <p className="text-sm text-gray-600">Size</p>
              <div className="mt-2 flex gap-2">
                {product.sizes?.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-3 py-2 rounded-full border ${
                      selectedSize === s ? "bg-brand-navy text-white" : "bg-white"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* COLOR */}
            <div>
              <p className="text-sm text-gray-600">Color</p>
              <div className="mt-2 flex gap-2">
                {product.colors?.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`px-3 py-2 rounded-full border ${
                      selectedColor === c ? "bg-brand-navy text-white" : "bg-white"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* QUANTITY + BUTTONS */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="px-3 py-2 bg-white rounded"
              >
                -
              </button>
              <div className="px-4 py-2 bg-white rounded">{qty}</div>
              <button
                onClick={() => setQty(qty + 1)}
                className="px-3 py-2 bg-white rounded"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="ml-6 px-6 py-3 rounded-full bg-brand-navy text-brand-ivory font-semibold hover:bg-brand-gold hover:text-brand-navy transition"
            >
              Add to Cart
            </button>

            <button
              onClick={handleAddToWishlist}
              className="px-6 py-3 rounded-full border border-brand-gold text-brand-navy hover:bg-brand-gold hover:text-white transition"
            >
              Add to Wishlist
            </button>
          </div>

          {/* EXTRA DETAILS */}
          <div className="text-sm text-gray-500 mt-4 space-y-1">
            <div>SKU: {product.sku}</div>
            <div>Fabric: {product.fabric}</div>
            <div>Care: {product.care}</div>
            <div>Edition: {product.limitedEdition ? "Limited" : "Standard"}</div>
            <div>
              Dimensions: {product.dimensionsCm?.length} x {product.dimensionsCm?.width} cm
            </div>
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
        © 2025 Royal Threads — Signature Series
      </footer>
    </div>
  );
}
