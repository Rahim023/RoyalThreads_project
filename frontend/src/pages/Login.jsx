import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa"; // icons
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
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
        <div className="bg-white/90 backdrop-blur-md shadow-luxe rounded-2xl p-8 w-full max-w-md border-2">
          <h1 className="text-3xl font-bold text-center text-brand-navy mb-6">
            Login
          </h1>

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
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-gold focus:outline-none"
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
                className="w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-brand-gold focus:outline-none"
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
          <div className="mt-6 flex gap-4">
            <button className="flex-1 flex items-center justify-center py-2 border rounded-lg hover:bg-gray-100 transition">
              <FcGoogle className="mr-2 text-xl" />
              Sign in with Google
            </button>
            <button className="flex-1 flex items-center justify-center py-2 border rounded-lg hover:bg-gray-100 transition">
              <FaApple className="mr-2 text-xl" />
             Sign in with Apple
            </button>
          </div>

          <p className="text-sm text-center text-gray-600 mt-4">
            Don’t have an account?{" "}
            <a href="/signup" className="text-brand-gold hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
