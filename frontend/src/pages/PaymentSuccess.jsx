// src/pages/PaymentSuccess.jsx
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { useParams, useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);

  useEffect(() => {
    // Load stored order list
    const orders = JSON.parse(localStorage.getItem("allOrders")) || [];

    const found = orders.find((o) => o.id === orderId);
    setOrder(found || null);
  }, [orderId]);

  const handleViewOrders = () => {
    navigate(`/order-status/${orderId}`);
  };

  return (
    <div className="min-h-screen bg-brand-mist">
      <Header />

      <div className="py-20 px-6 flex justify-center">
        <div className="bg-white shadow-xl rounded-2xl p-10 max-w-2xl w-full text-center">
          <h1 className="text-4xl font-bold text-brand-navy flex justify-center gap-2">
            🎉 Payment Successful!
          </h1>

          <p className="mt-4 text-gray-700">
            Your payment has been processed for order:
          </p>

          <p className="mt-2 text-2xl font-bold text-brand-gold">
            #{orderId}
          </p>

          <button
            onClick={handleViewOrders}
            className="mt-8 px-6 py-3 bg-brand-navy text-white rounded-lg text-lg font-semibold hover:bg-brand-gold hover:text-brand-navy transition"
          >
            View My Orders
          </button>
        </div>
      </div>
    </div>
  );
}
