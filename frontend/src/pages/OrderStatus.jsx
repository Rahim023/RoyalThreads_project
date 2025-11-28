import React, { useEffect, useState } from "react";
import Header from "../components/Header";

export default function OrderStatus() {
  const [order, setOrder] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const estimatedDelivery = "February 5, 2025";
  const currentLocation = "Toronto Dispatch Centre";

  const cancellationReasons = [
    "Ordered by mistake",
    "Found a better price",
    "Delivery time is too long",
    "Item no longer needed",
    "Other",
  ];

  // Load order from localStorage
  useEffect(() => {
    const savedOrder = localStorage.getItem("lastOrder");
    if (savedOrder) {
      setOrder(JSON.parse(savedOrder));
    }
  }, []);

  // ❌ CANCEL ORDER (REAL WORKING LOGIC)
  const handleCancelOrder = () => {
    const updatedOrder = {
      ...order,
      status: "Cancelled",
      cancelledAt: new Date().toLocaleString(),
      cancelledReason: cancelReason || "No reason provided",
    };

    setOrder(updatedOrder);
    localStorage.setItem("lastOrder", JSON.stringify(updatedOrder));

    setShowCancelModal(false);
  };

  // PROGRESS WIDTH (FOR 5 STEPS)
  const getProgressWidth = () => {
    if (!order || order.status === "Cancelled") return "0%";

    switch (order.status) {
      case "Ordered":
        return "10%";
      case "Processing":
        return "30%";
      case "Shipped":
        return "60%";
      case "Out for Delivery":
        return "85%";
      case "Delivered":
        return "100%";
      default:
        return "10%";
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden 
        bg-gradient-to-br from-[#f8f5ff] via-[#f2e8ff] to-[#d5e3ff]">
      
      <Header />

      <section className="py-16 px-6 md:px-20 flex-1 relative z-[10]">
        
        <h1 className="text-5xl font-serif font-bold text-brand-navy text-center mb-14">
          Order Status 📦
        </h1>

        
        {!order ? (
          <p className="text-center text-brand-charcoal text-lg">
            No order found. Please place an order first.
          </p>
        ) : (
          <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-xl 
            border border-[#f3cf85] shadow-xl rounded-3xl p-10">

            {/* If Order is Cancelled */}
            {order.status === "Cancelled" && (
              <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-xl mb-6">
                ❌ <b>Your order has been cancelled.</b><br />
                Reason: {order.cancelledReason}<br />
                Time: {order.cancelledAt}
              </div>
            )}

            {/* ORDER HEADER */}
            <div className="mb-10 pb-6 border-b border-[#f0d9a2]">
              <h2 className="text-2xl md:text-3xl font-bold text-brand-navy">
                Order ID:
                <span className="text-brand-gold ml-2">{order.id}</span>
              </h2>

              <p className="text-brand-charcoal mt-3 text-lg">
                Current Status:{" "}
                <span
                  className={`font-semibold ${
                    order.status === "Cancelled"
                      ? "text-red-600"
                      : "text-brand-gold"
                  }`}
                >
                  {order.status}
                </span>
              </p>

              {order.status !== "Cancelled" && (
                <>
                  <p className="text-brand-navy mt-2">
                    📍 <b>Current Location:</b> {currentLocation}
                  </p>

                  <p className="text-brand-navy mt-1">
                    🚚 <b>Arriving By:</b>{" "}
                    <span className="text-brand-gold">{estimatedDelivery}</span>
                  </p>
                </>
              )}
            </div>

            {/* ORDER PROGRESS BAR (Disabled when cancelled) */}
            <div className="mb-10">
              <h3 className="text-xl font-bold text-brand-navy mb-4">
                Order Timeline
              </h3>

              <div className="flex justify-between text-sm font-medium mb-2">
                {[
                  "Ordered",
                  "Processing",
                  "Shipped",
                  "Out for Delivery",
                  "Delivered",
                ].map((step) => (
                  <span
                    key={step}
                    className={`${
                      order.status === "Cancelled"
                        ? "text-gray-400"
                        : step === order.status
                        ? "text-brand-gold font-bold"
                        : "text-gray-500"
                    }`}
                  >
                    {step}
                  </span>
                ))}
              </div>

              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-3 ${
                    order.status === "Cancelled"
                      ? "bg-red-400"
                      : "bg-gradient-to-r from-brand-gold to-yellow-400"
                  } transition-all duration-700`}
                  style={{ width: getProgressWidth() }}
                ></div>
              </div>
            </div>

            {/* ORDER ITEMS */}
            <div className="space-y-5">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-white/70 p-4 
                    rounded-xl shadow-sm border border-gray-100"
                >
                  <span className="font-medium text-brand-navy text-lg">
                    {item.title}
                  </span>
                  <span className="font-semibold text-brand-gold">
                    ${item.price}.00 × {item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* TOTAL */}
            <div className="mt-10 text-right">
              <h3 className="text-2xl font-bold text-brand-navy">
                Total: <span className="text-brand-gold">${order.total}.00</span>
              </h3>
            </div>

            {/* CANCEL ORDER BUTTON */}
            {order.status !== "Cancelled" &&
              order.status !== "Shipped" &&
              order.status !== "Out for Delivery" &&
              order.status !== "Delivered" && (
                <div className="mt-10 flex justify-end">
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-xl
                      shadow-lg transition-all"
                  >
                    Cancel Order
                  </button>
                </div>
              )}
          </div>
        )}
      </section>

      {/* CANCEL MODAL */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl w-[90%] max-w-md shadow-xl">
            <h2 className="text-2xl font-bold mb-4 text-brand-navy">Cancel Order</h2>

            <p className="mb-3 text-gray-700">Select a reason for cancellation:</p>

            <select
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full p-3 border rounded-lg mb-6"
            >
              <option value="">-- Choose Reason --</option>
              {cancellationReasons.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>

            <div className="flex justify-between">
              <button
                className="px-5 py-2 bg-gray-300 rounded-lg"
                onClick={() => setShowCancelModal(false)}
              >
                Close
              </button>

              <button
                className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                onClick={handleCancelOrder}
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-brand-navy text-brand-ivory py-6 text-center">
        <p className="text-sm">© 2025 MyClothing. All rights reserved.</p>
      </footer>
    </div>
  );
}
