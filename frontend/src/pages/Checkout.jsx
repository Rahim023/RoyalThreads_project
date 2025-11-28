import React from "react";
import Header from "../components/Header";
import { useCart } from "./CartContext";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  // ✅ Calculate total cost
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;

    // Create a temporary order ID
    const orderId = "ORD-" + Date.now();

    const newOrder = {
      id: orderId,
      items: cart,
      total,
      status: "Awaiting Payment",   // updated status
    };

    // Save order in localStorage (temporary until payment)
    localStorage.setItem("pendingOrder", JSON.stringify(newOrder));

    // Clear the cart
    clearCart();

    // Redirect user to the payment method selection page
    navigate(`/payment/${orderId}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* 🔹 Header */}
      <Header />

      <section className="py-16 px-6 md:px-20 flex-1 bg-brand-mist">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-navy text-center mb-10">
          Checkout 🛍️
        </h1>

        {cart.length === 0 ? (
          <p className="text-center text-brand-charcoal">
            Your cart is empty. Add some products first.
          </p>
        ) : (
          <div className="max-w-3xl mx-auto bg-white shadow-luxe rounded-xl p-6">
            {/* 🔹 Order Summary */}
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b py-2"
              >
                <span>{item.title}</span>
                <span>
                  ${item.price}.00 × {item.quantity}
                </span>
              </div>
            ))}

            <h3 className="text-lg font-bold mt-6">Total: ${total}.00</h3>

            {/* 🔹 Place Order Button */}
            <button
              onClick={handlePlaceOrder}
              className="mt-6 w-full py-3 bg-brand-gold text-brand-navy font-semibold rounded-lg shadow hover:bg-brand-ivory hover:text-brand-navy transition"
            >
              Place Order
            </button>
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
