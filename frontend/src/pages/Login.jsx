import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa"; // icons
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import Header from "../components/Header";
import { api } from "../services/api";
import LiquidEther from "./LiquidEther";
import Silk from "../components/Silk";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // toggle password
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({ _id: res.data._id, email: res.data.email })
      );
      alert("Login Successful 🎉");
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Invalid email or password ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Liquid Ether Background */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -1,
          pointerEvents: "none",
          backgroundColor: "black",
        }}
      >        <Silk speed={5} scale={1} color="#f5f0e6" noiseIntensity={0} rotation={0} />
      </div>

      <Header />

      {/* Login Form */}
      <section className="flex flex-1 items-center justify-center relative z-10 px-6">
        <div className="bg-white/95 backdrop-blur-md shadow-luxe rounded-3xl p-8 w-full max-w-xl border-2 border-brand-ivory">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-brand-gold flex items-center justify-center font-sansTrend text-brand-navy text-xl font-bold">RT</div>
            <div>
              <h1 className="text-3xl font-sansTrend font-bold text-brand-navy">Welcome Back</h1>
              <p className="text-sm text-gray-500">Sign in to continue to RoyalThreads</p>
            </div>
          </div>

          {error && <p className="text-red-600 text-center mb-4">{error}</p>}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Input */}
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-brand-gold focus:outline-none"
                required
              />
            </div>

            {/* Password Input with show/hide */}
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border rounded-xl focus:ring-2 focus:ring-brand-gold focus:outline-none"
                required
              />
              <div
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-brand-navy text-white rounded-lg hover:bg-brand-gold hover:text-brand-charcoal transition disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Social Login: Row Layout */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button className="flex items-center justify-center py-2 border rounded-xl hover:bg-gray-50 transition gap-2">
              <FcGoogle className="text-2xl" />
              <span className="font-medium">Continue with Google</span>
            </button>
            <button className="flex items-center justify-center py-2 border rounded-xl hover:bg-gray-50 transition gap-2">
              <FaApple className="text-2xl" />
              <span className="font-medium">Continue with Apple</span>
            </button>
          </div>

          <div className="mt-6 flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600">
              <input type="checkbox" className="rounded" /> Remember me
            </label>
            <a href="/signup" className="text-brand-gold hover:underline">
              Create an account
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
