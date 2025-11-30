// src/pages/OrderStatus.jsx
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { useCurrency } from "../context/CurrencyContext";
import { motion } from "framer-motion";

export default function OrderStatus() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCancel, setShowCancel] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const { currencySymbol, convertPrice } = useCurrency();
  const orderId = localStorage.getItem("lastOrderId");

  const cancellationReasons = [
    "Ordered by mistake",
    "Found a better price elsewhere",
    "Delivery taking too long",
    "Item not needed anymore",
    "Changed my mind",
    "Other",
  ];

  // ⭐ Fetch order from backend using lastOrderId
  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          setLoading(false);
          return;
        }

        const data = await res.json();
        setOrder(data);
      } catch (err) {
        console.error("Order fetch error:", err);
      }

      setLoading(false);
    }

    fetchOrder();
  }, [orderId]);

  // ⭐ Cancel order in backend
  const handleCancelOrder = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/orders/cancel/${order._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ reason: cancelReason }),
        }
      );

      const updated = await res.json();
      setOrder(updated);
      setShowCancel(false);
    } catch (err) {
      console.error("Cancel failed:", err);
    }
  };

  // ⭐ Delete order from backend
  const handleDeleteOrder = async () => {
    try {
      const token = localStorage.getItem("token");

      await fetch(`http://localhost:5000/api/orders/${order._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.removeItem("lastOrderId");
      setOrder(null);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // ⭐ Progress Bar Logic
  const progressWidth = () => {
    if (!order) return "0%";
    if (order.status === "Cancelled") return "0%";

    const steps = {
      Ordered: "15%",
      Processing: "35%",
      Shipped: "65%",
      "Out for Delivery": "85%",
      Delivered: "100%",
    };

    return steps[order.status] || "15%";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-mist">
        <Header />
        <div className="text-brand-navy mt-20 text-xl">Loading order...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-brand-mist">
        <Header />
        <div className="text-center py-40 text-lg text-brand-navy font-semibold">
          No order found. Please place an order first.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-ivory to-brand-mist font-inter">
      <Header />

      <section className="px-6 md:px-20 py-16">
        <h1 className="text-center text-4xl md:text-5xl font-sansTrend font-bold text-brand-navy mb-12">
          Order Status
        </h1>

        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-brand-gold/30 p-10">

          {/* ⭐ CANCELLED BANNER */}
          {order.status === "Cancelled" && (
            <div className="bg-red-100 text-red-700 p-4 rounded-xl border border-red-300 mb-6">
              ❌ <b>Your order was cancelled</b>
              <div>Reason: {order.cancelledReason}</div>
              <div>Time: {new Date(order.cancelledAt).toLocaleString()}</div>
            </div>
          )}

          {/* ⭐ Header */}
          <div className="pb-6 border-b border-brand-gold/40 mb-10">
            <h2 className="text-2xl font-bold text-brand-navy">
              Order ID:
              <span className="text-brand-gold ml-2">{order._id}</span>
            </h2>

            <p className="text-lg mt-2 text-brand-charcoal">
              Status:{" "}
              <span className="text-brand-gold font-semibold">
                {order.status}
              </span>
            </p>

            {order.status !== "Cancelled" && (
              <>
                <p className="text-brand-navy mt-2">
                  📍 <b>Location:</b> Toronto Dispatch Centre
                </p>
                <p className="text-brand-navy mt-1">
                  🚚 <b>Est. Delivery:</b>{" "}
                  <span className="text-brand-gold">February 5, 2025</span>
                </p>
              </>
            )}
          </div>

          {/* ⭐ Progress Bar */}
          <h3 className="text-xl font-bold text-brand-navy mb-4">
            Delivery Progress
          </h3>

          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-4">
            <motion.div
              className={`h-full ${
                order.status === "Cancelled"
                  ? "bg-red-500"
                  : "bg-brand-gold"
              }`}
              initial={{ width: 0 }}
              animate={{ width: progressWidth() }}
              transition={{ duration: 1 }}
            />
          </div>

          <div className="flex justify-between text-sm text-gray-600 mb-10">
            {["Ordered", "Processing", "Shipped", "Out for Delivery", "Delivered"].map(
              (step) => (
                <span
                  key={step}
                  className={
                    order.status === step
                      ? "text-brand-gold font-bold"
                      : "text-gray-500"
                  }
                >
                  {step}
                </span>
              )
            )}
          </div>

          {/* ⭐ Order Items */}
          <h3 className="text-xl font-semibold text-brand-navy mb-4">Items</h3>

          <div className="space-y-4">
            {order.items.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="flex justify-between items-center bg-white p-4 rounded-xl shadow border border-gray-200"
              >
                <div className="font-semibold text-brand-navy">
                  {item.title}
                </div>

                <div className="font-bold text-brand-gold">
                  {currencySymbol}
                  {convertPrice(item.price)} × {item.quantity}
                </div>
              </motion.div>
            ))}
          </div>

          {/* ⭐ Total */}
          <div className="text-right mt-10">
            <h3 className="text-2xl font-bold text-brand-navy">
              Total:{" "}
              <span className="text-brand-gold">
                {currencySymbol}
                {convertPrice(order.totalINR)}
              </span>
            </h3>
          </div>

          {/* ⭐ Buttons */}
          <div className="mt-12 flex justify-between">

            {/* Cancel Button */}
            {order.status !== "Cancelled" &&
              !["Shipped", "Out for Delivery", "Delivered"].includes(
                order.status
              ) && (
                <button
                  onClick={() => setShowCancel(true)}
                  className="px-6 py-3 bg-red-600 text-white rounded-xl shadow hover:bg-red-700"
                >
                  Cancel Order
                </button>
              )}

            {/* Delete Button */}
            <button
              onClick={handleDeleteOrder}
              className="px-6 py-3 bg-gray-400 text-white rounded-xl shadow hover:bg-gray-500"
            >
              Delete Order
            </button>
          </div>
        </div>
      </section>

      {/* ⭐ Cancel Modal */}
      {showCancel && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-[90%] max-w-md">
            <h2 className="text-2xl font-bold text-brand-navy mb-4">
              Cancel Order
            </h2>

            <p>Select a reason:</p>

            <select
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full p-3 border rounded-xl mt-3 mb-6"
            >
              <option value="">-- Choose Reason --</option>
              {cancellationReasons.map((reason) => (
                <option key={reason}>{reason}</option>
              ))}
            </select>

            <div className="flex justify-between">
              <button
                onClick={() => setShowCancel(false)}
                className="px-4 py-2 rounded-xl bg-gray-300"
              >
                Close
              </button>

              <button
                onClick={handleCancelOrder}
                className="px-4 py-2 rounded-xl bg-red-600 text-white shadow hover:bg-red-700"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-brand-navy text-brand-ivory text-center py-6 mt-20">
        © 2025 RoyalThreads. All Rights Reserved.
      </footer>
    </div>
  );
}
