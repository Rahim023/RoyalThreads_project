// src/pages/Accessories.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import Header from "../components/Header";

export default function Accessories() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccessories = async () => {
      try {
        setLoading(true);
        const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";
        const response = await axios.get(`${API_BASE}/api/products`);
        const allProducts = response.data;

        // Filter only Accessories category
        const accessories = allProducts.filter(
          (item) =>
            item.category?.toLowerCase() === "accessories" ||
            item.category?.toLowerCase() === "accessory"
        );

        setProducts(accessories);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching accessories:", error);
        setLoading(false);
      }
    };

    fetchAccessories();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#0d1b2a]">
      {/* Header */}
      <Header />

      {/* Page Title */}
      <section className="text-center py-20 px-4 md:px-16">
        <h1 className="text-4xl md:text-5xl font-Playfair text-white drop-shadow-lg">
          Accessories Collection
        </h1>
        <p className="text-gray-300 text-lg mt-2">
          Explore premium accessories crafted for elegance and everyday style.
        </p>
      </section>

      {/* Product Grid */}
      <section className="px-4 md:px-16 pb-20 flex-1">
        {loading ? (
          <p className="text-gray-300 text-center">Loading accessories...</p>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-gray-300 text-center">
            No accessories available right now.
          </p>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-brand-navy text-brand-ivory py-8 text-center">
        <p className="text-sm">© 2025 MyClothing. All rights reserved.</p>
      </footer>
    </div>
  );
}
