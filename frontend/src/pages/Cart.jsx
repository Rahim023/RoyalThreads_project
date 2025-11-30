import React from "react";
import Header from "../components/Header";
import { useCart } from "./CartContext";
import { Link } from "react-router-dom";

// ⭐ Currency context import
import { useCurrency } from "../context/CurrencyContext";

export default function Cart() {
  const { cart, removeFromCart, clearCart } = useCart();

  const { convertPrice, country } = useCurrency();

  // ⭐ Currency symbols
  const currencySymbol =
    country === "Canada" ? "CA$" :
    country === "USA" ? "US$" :
    "₹";

  // ⭐ Total in converted amount (INR → CAD/USD/INR)
  const totalConverted = cart.reduce(
    (sum, item) => sum + Number(convertPrice(item.price)) * item.quantity,
    0
  ).toFixed(2);

  return (
    <div className="min-h-screen flex flex-col">
      {/* 🔹 Global Header */}
      <Header />

      <section className="py-16 px-6 md:px-20 flex-1 bg-brand-mist">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-navy text-center mb-10">
          Your Shopping Cart 🛒
        </h1>

        {/* ✅ Empty Cart Condition */}
        {cart.length === 0 ? (
          <p className="text-center text-brand-charcoal">
            Your cart is empty. Start shopping now!
          </p>
        ) : (
          <div className="max-w-4xl mx-auto bg-white shadow-luxe rounded-xl p-6">

            {/* ⭐ Cart Items */}
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b py-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded-lg shadow"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{item.title}</h3>

                    {/* ⭐ Converted price display */}
                    <p className="text-brand-gold font-bold">
                      {currencySymbol} {convertPrice(item.price)} × {item.quantity}
                    </p>
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Remove
                </button>
              </div>
            ))}

            {/* ⭐ Cart Summary */}
            <div className="flex justify-between items-center mt-6">
              <h2 className="text-xl font-bold">
                Total: {currencySymbol} {totalConverted}
              </h2>

              <div className="flex gap-4">
                <button
                  onClick={clearCart}
                  className="px-5 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                >
                  Clear Cart
                </button>

                <Link
                  to="/checkout"
                  className="px-6 py-2 bg-brand-gold text-brand-navy font-semibold rounded-lg shadow hover:bg-brand-ivory hover:text-brand-navy transition"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 🔹 Footer */}
      <footer className="bg-brand-navy text-brand-ivory py-6 text-center">
        <p className="text-sm">© 2025 MyClothing. All rights reserved.</p>
      </footer>
    </div>
  );
}
