import React from "react";
import Header from "../components/Header";
import { useWishlist } from "./WishlistContext";
import { useCart } from "./CartContext";
import "../index.css";

export default function Wedding() {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  // Wedding Featured Products (slider)
  const featuredWedding = [
    {
      id: 1,
      title: "Velvet Mirror-Work Lehenga",
      price: 299,
      image: "/images/wedding1.jpg",
    },
    {
      id: 2,
      title: "Royal Red Bridal Lehenga",
      price: 349,
      image: "/images/wedding2.jpg",
    },
    {
      id: 3,
      title: "Sherwani Golden Embroidered",
      price: 199,
      image: "/images/wedding3.jpg",
    },
    {
      id: 4,
      title: "Premium Bridal Jewelry Set",
      price: 149,
      image: "/images/wedding4.jpg",
    },
  ];

  // Explore All Wedding Items
  const allWeddingProducts = [
    {
      id: 11,
      title: "Designer Bridal Lehenga",
      price: 399,
      image: "/images/wedding5.jpg",
    },
    {
      id: 12,
      title: "Traditional Sherwani Set",
      price: 259,
      image: "/images/wedding6.jpg",
    },
    {
      id: 13,
      title: "Silk Bridal Saree",
      price: 199,
      image: "/images/wedding7.jpg",
    },
    {
      id: 14,
      title: "Royal Groom Turban",
      price: 79,
      image: "/images/wedding8.jpg",
    },
    {
      id: 15,
      title: "Handcrafted Bridal Dupatta",
      price: 129,
      image: "/images/wedding9.jpg",
    },
    {
      id: 16,
      title: "Wedding Jewelry Set (Gold Polish)",
      price: 189,
      image: "/images/wedding10.jpg",
    },
  ];

  return (
    <div className="wedding-bg min-h-screen">
      <Header />

      {/* ---------------------------
           FEATURED SECTION
      ---------------------------- */}
      <section className="py-10 px-6 md:px-12">
        <h1 className="text-center text-5xl md:text-6xl font-serif text-brand-navy animate-fadeDown shimmer-gold">
          Featured Wedding Styles
        </h1>
        <p className="text-center mt-3 text-lg italic text-brand-navy">
          Handpicked luxury outfits for your special day ✨
        </p>

        {/* 3D Stacked Cards Slider */}
        <div className="relative mt-10 flex items-center justify-center h-[420px]">
          <div className="flex space-x-[-40px] md:space-x-[-60px]">
            {featuredWedding.map((item, index) => (
              <div
                key={item.id}
                className="w-[230px] md:w-[260px] h-[340px] wedding-card p-3 animate-stagger"
                style={{
                  animationDelay: `${index * 0.15}s`,
                  transform: `rotate(${index * 3}deg)`,
                  zIndex: 20 - index,
                }}
              >
                <img
                  src={item.image}
                  className="w-full h-[260px] rounded-xl object-cover"
                />
                <h3 className="mt-3 font-bold text-brand-navy text-center">
                  {item.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------
           EXPLORE ALL PRODUCTS
      ---------------------------- */}
      <section className="py-14 px-6 md:px-20">
        <h2 className="text-center text-4xl md:text-5xl font-bold text-brand-navy mb-10 animate-fadeDown">
          Explore Wedding Collection
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {allWeddingProducts.map((item, index) => (
            <div
              key={item.id}
              className="wedding-card animate-stagger"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image */}
              <div className="wedding-img-wrap">
                <img src={item.image} className="wedding-img" alt={item.title} />
              </div>

              {/* Info */}
              <div className="p-5 text-center">
                <h3 className="text-lg font-semibold text-brand-navy">
                  {item.title}
                </h3>

                <p className="text-brand-gold font-bold mt-1">${item.price}.00</p>

                {/* Buttons */}
                <div className="flex justify-center gap-3 mt-4">
                  <button
                    className="btn-luxe"
                    onClick={() => addToCart(item)}
                  >
                    Add to Cart
                  </button>

                  <button
                    className={`wishlist-btn ${
                      wishlist.some((w) => w.id === item.id)
                        ? "wishlist-active"
                        : ""
                    }`}
                    onClick={() => toggleWishlist(item)}
                  >
                    ♥
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
