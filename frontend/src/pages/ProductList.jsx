import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";

export default function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");

        const mapped = res.data.map((p) => {
          return {
            ...p,
            id: p.id || p._id,    // 🔥 Always create ID
            _id: p._id || p.id    // 🔥 Always create _id
          };
        });

        console.log("🔥 FINAL PRODUCTS SENT TO CARD:", mapped);
        setProducts(mapped);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
