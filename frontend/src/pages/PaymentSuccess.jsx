// src/pages/PaymentSuccess.jsx
import React, { useEffect } from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { useCurrency } from "../context/CurrencyContext";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const { convertPrice } = useCurrency();

  useEffect(() => {
    async function finalizeOrder() {
      const pending = JSON.parse(localStorage.getItem("pendingOrder"));
      if (!pending) return;

      // ⭐ Create a final order record
      const finalOrder = {
        id: pending.id,
        items: pending.items,
        total: pending.total,
        status: "Ordered",
        createdAt: new Date().toLocaleString(),
      };

      // ⭐ SAVE FINAL ORDER
      localStorage.setItem("lastOrder", JSON.stringify(finalOrder));

      // ⭐ REMOVE pending order AFTER saving final
      localStorage.removeItem("pendingOrder");

      // (Optional backend save)
      const token = localStorage.getItem("token");
      if (token) {
        try {
          await fetch("http://localhost:5000/api/orders", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              items: finalOrder.items,
              totalInINR: finalOrder.total,
              paymentMethod: "card",
            }),
          });
        } catch (err) {
          console.error("Order save error:", err);
        }
      }
    }

    finalizeOrder();
  }, []);

  return (
    <div className="min-h-screen bg-brand-mist flex flex-col">
      <Header />

      <section className="text-center py-24">
        <h1 className="text-4xl font-bold text-brand-navy">
          Payment Successful 🎉
        </h1>
        <p className="mt-4 text-lg text-brand-charcoal">
          Thank you for your purchase!
        </p>

        <button
          onClick={() => navigate("/orders")}
          className="mt-8 px-6 py-3 bg-brand-gold text-brand-navy rounded-lg font-semibold shadow hover:bg-brand-ivory transition"
        >
          View Your Order
        </button>
      </section>
    </div>
  );
}
