import React, { useState } from "react";
import allProducts from "../data/allProducts";  // ⭐ Import global product list

export default function SearchModal({ onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = (text) => {
    setQuery(text);

    if (!text.trim()) {
      setResults([]);
      return;
    }

    const filtered = allProducts.filter((item) =>
      item.title.toLowerCase().includes(text.toLowerCase())
    );

    setResults(filtered);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white w-[600px] p-6 rounded-xl shadow-xl border">

        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold text-brand-navy">Search Products</h2>
          <button className="text-2xl" onClick={onClose}>&times;</button>
        </div>

        {/* Input */}
        <input
          type="text"
          placeholder="Search for clothing, jewelry, accessories..."
          className="w-full p-3 border rounded-lg"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
        />

        {/* Results */}
        <div className="mt-4 max-h-72 overflow-y-auto">
          {results.length === 0 && query && (
            <p className="text-gray-500 text-center">No results found.</p>
          )}

          {results.map((item) => (
            <div
              key={item.id}
              className="p-3 border-b flex gap-3 items-center cursor-pointer hover:bg-gray-100"
              onClick={() => (window.location.href = `/${item.category.toLowerCase()}/${item.slug}`)}
            >
              
              <div>
                <p className="font-semibold">{item.title}</p>
                <p className="text-sm text-gray-500">${item.price}</p>
                <p className="text-xs text-brand-gold">{item.category}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
