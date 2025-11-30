// src/pages/Checkout.jsx
import React from "react";
import Header from "../components/Header";
import { useCart } from "./CartContext";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { useCurrency } from "../context/CurrencyContext";

export default function Checkout() {
  const { cart, clearCart, removeFromCart } = useCart();
  const navigate = useNavigate();
  const { convertPrice, country } = useCurrency();

  const currencySymbol =
    country === "Canada" ? "CA$" :
    country === "USA" ? "US$" :
    "₹";

  const totalConverted = cart
    .reduce(
      (sum, item) =>
        sum + Number(convertPrice(item.price)) * Number(item.quantity),
      0
    )
    .toFixed(2);

  // ⭐ PLACE ORDER (Backend Working)
  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;

    const totalINR = cart.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0
    );

    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        items: cart.map((i) => ({
          productId: String(i.id),
          title: i.title,
          price: Number(i.price),
          quantity: Number(i.quantity),
          size: i.size,
          img: i.img,
        })),
        totalINR,
      }),
    });

    const data = await res.json();

    localStorage.setItem("lastOrderId", data.order._id);

    clearCart();
    navigate(`/payment/${data.order._id}`);
  };

  return (
    <div className="min-h-screen bg-brand-mist font-sansTrend">
      <Header />

      <section className="py-16 px-6 md:px-20">
        <h1 className="text-center text-5xl font-bold text-brand-navy mb-12 tracking-tight">
          Checkout
        </h1>

        {cart.length === 0 ? (
          <p className="text-center text-brand-charcoal text-lg">
            Your cart is empty.
          </p>
        ) : (
          <div className="max-w-4xl mx-auto bg-white shadow-xl border border-brand-gold/40 rounded-3xl p-10">

            {/* SUMMARY HEADER */}
            <h2 className="text-3xl font-semibold text-brand-navy mb-8">
              Order Summary
            </h2>

            {/* PRODUCT LIST */}
            <div className="space-y-6">
              {cart.map((item) => (
                <div
                  key={`${item.id}-${item.size}`}
                  className="flex justify-between items-center bg-brand-ivory/40 border border-brand-gold/30 p-4 rounded-2xl shadow-sm"
                >
                  {/* LEFT SIDE */}
                  <div>
                    <p className="text-lg font-semibold text-brand-navy">
                      {item.title}
                    </p>
                    <p className="text-sm text-brand-charcoal">
                      Size: <span className="font-medium">{item.size}</span>
                    </p>
                    <p className="text-sm text-brand-charcoal">
                      Qty: <span className="font-medium">{item.quantity}</span>
                    </p>
                  </div>

                  {/* PRICE */}
                  <div className="text-right">
                    <p className="text-lg font-bold text-brand-gold">
                      {currencySymbol} {convertPrice(item.price)}
                    </p>
                  </div>

                  {/* DELETE BUTTON */}
                  <button
  onClick={() => removeFromCart(item.productId)}
  className="ml-4 text-red-600 hover:text-red-800"
>
                    <Trash2 size={22} />
                  </button>
                </div>
              ))}
            </div>

            {/* TOTAL PRICE */}
            <div className="text-right mt-10">
              <h3 className="text-3xl font-bold text-brand-navy">
                Total:{" "}
                <span className="text-brand-gold">
                  {currencySymbol} {totalConverted}
                </span>
              </h3>
            </div>

            {/* BUTTONS */}
            <div className="mt-10 flex flex-col md:flex-row justify-between gap-4">
              <button
                onClick={clearCart}
                className="w-full md:w-auto px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-md transition font-semibold"
              >
                Clear Cart
              </button>

              <button
                onClick={handlePlaceOrder}
                className="w-full md:w-auto px-8 py-3 bg-brand-gold text-brand-navy hover:bg-brand-navy hover:text-white rounded-xl shadow-md transition font-bold"
              >
                Place Order
              </button>
            </div>
          </div>
        )}
      </section>

      <footer className="bg-brand-navy text-brand-ivory py-6 text-center mt-20">
        <p className="text-sm">© 2025 RoyalThreads. All rights reserved.</p>
      </footer>
    </div>
  );
}
