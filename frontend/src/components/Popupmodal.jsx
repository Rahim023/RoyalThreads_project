import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function PopupModal({ isOpen, message, closeModal, redirectTo }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      onClick={closeModal}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.7, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.7 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-2xl shadow-2xl p-6 w-[330px]
                   border-[3px] border-transparent 
                   bg-gradient-to-r from-white to-white 
                   [background-clip:padding-box,border-box] 
                   before:absolute before:inset-0 before:rounded-2xl 
                   before:p-[3px] before:bg-gradient-to-r 
                   before:from-blue-900 before:to-yellow-500 before:-z-10"
      >
        {/* Success Icon */}
        <div className="flex justify-center mb-3">
          <CheckCircle className="text-green-600" size={48} />
        </div>

        <h2 className="text-xl font-semibold text-center mb-4 text-gray-800">
          {message}
        </h2>

        {/* Buttons */}
        <div className="flex flex-col gap-3 mt-4">
          <Link
            to={redirectTo}
            onClick={closeModal}
            className="text-center py-2 rounded-xl font-medium shadow-md
                      text-white transition-transform duration-200
                      hover:scale-[1.03]"
            style={{
              background: "linear-gradient(45deg, navy, gold)",
            }}
          >
            Go to {redirectTo.replace("/", "")}
          </Link>

          <button
            className="text-center py-2 rounded-xl font-medium bg-gray-200 hover:bg-gray-300 
                       transition-all"
            onClick={closeModal}
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}
