import React, { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import api from "../services/api";
import { motion } from "framer-motion";
import Silk from "../components/Silk";

export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    postalCode: "",
    country: "",
  });

  const [errors, setErrors] = useState({});
  const [signupSuccess, setSignupSuccess] = useState(false); // ⭐ NEW
  const refs = {
    username: useRef(),
    email: useRef(),
    password: useRef(),
    confirmPassword: useRef(),
    phone: useRef(),
    postalCode: useRef(),
    country: useRef(),
  };

  const countries = [
    "Canada",
    "USA",
    "India",
    "UK",
    "Australia",
    "Germany",
    "France",
    "Other",
  ];

  const validate = () => {
    const errs = {};
    const postalRegex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
    const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!formData.username) errs.username = "Username required";
    if (!formData.email) errs.email = "Email required";

    if (!formData.password) errs.password = "Password required";
    else if (!pwdRegex.test(formData.password))
      errs.password =
        "Password must have 1 uppercase, 1 lowercase, 1 number and 8+ chars";

    if (formData.password !== formData.confirmPassword)
      errs.confirmPassword = "Passwords do not match";

    if (!formData.phone) errs.phone = "Phone number required";

    if (!formData.postalCode) errs.postalCode = "Postal code required";
    else if (!postalRegex.test(formData.postalCode))
      errs.postalCode = "Invalid postal code";

    if (!formData.country) errs.country = "Country required";

    setErrors(errs);
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();

    if (Object.keys(errs).length > 0) {
      const firstError = Object.keys(errs)[0];
      const el = refs[firstError].current;

      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("shake");
        setTimeout(() => el.classList.remove("shake"), 500);
      }
      return;
    }

    try {
      await api.post("/auth/register", formData);

      // ⭐ Trigger success loading overlay
      setSignupSuccess(true);

      // ⭐ Smooth Redirect
      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      setErrors({
        email: err.response?.data?.message || "Signup failed",
      });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  return (
    <>
      {/* Background */}
      <div
        style={{
          width: "100%",
          height: "100vh",
          position: "fixed",
          inset: 0,
          zIndex: -1,
          backgroundColor: "navy",
        }}
      >
        <Silk speed={5} scale={1} color="#f5f0e6" noiseIntensity={0} rotation={0} />
      </div>

      <div className="min-h-screen flex flex-col relative">
        <Header />

        <section className="flex flex-1 justify-center items-center py-10 px-4">
          <motion.div
            className="relative font-sansTrend w-full max-w-2xl z-10 p-[6px] rounded-3xl"
            style={{
              background: "linear-gradient(90deg, #0B2545, #FFD700, #0B2545)",
              backgroundSize: "400% 400%",
              boxShadow: "0 8px 40px rgba(11, 18, 59, 0.25)",
            }}
          >
            <div className="bg-white rounded-3xl p-10 shadow-2xl w-full">

              {/* Header */}
              <div className="flex items-center gap-6 mb-4">
                <div className="w-14 h-14 rounded-full bg-brand-gold flex items-center justify-center text-brand-navy font-bold text-lg">
                  RT
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-brand-navy">
                    Create Your Account
                  </h1>
                  <p className="text-sm text-gray-500">
                    Join RoyalThreads — enjoy curated fashion & fast checkout
                  </p>
                </div>
              </div>

              {/* FORM */}
              <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">

                {/* Username */}
                <div className="col-span-2 md:col-span-1">
                  <label className="text-sm text-gray-600">Username</label>
                  <input
                    ref={refs.username}
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Username"
                    className={`w-full mt-1 px-4 py-2 border rounded-xl 
                      ${errors.username ? "border-red-500" : ""}`}
                  />
                  {errors.username && (
                    <p className="text-red-600 text-sm">{errors.username}</p>
                  )}
                </div>

                {/* Email */}
                <div className="col-span-2 md:col-span-1">
                  <label className="text-sm text-gray-600">Email</label>
                  <input
                    ref={refs.email}
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className={`w-full mt-1 px-4 py-2 border rounded-xl 
                      ${errors.email ? "border-red-500" : ""}`}
                  />
                  {errors.email && (
                    <p className="text-red-600 text-sm">{errors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="text-sm text-gray-600">Password</label>
                  <input
                    ref={refs.password}
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className={`w-full mt-1 px-4 py-2 border rounded-xl 
                      ${errors.password ? "border-red-500" : ""}`}
                  />
                  {errors.password && (
                    <p className="text-red-600 text-sm">{errors.password}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="text-sm text-gray-600">Confirm Password</label>
                  <input
                    ref={refs.confirmPassword}
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm Password"
                    className={`w-full mt-1 px-4 py-2 border rounded-xl 
                      ${errors.confirmPassword ? "border-red-500" : ""}`}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-600 text-sm">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="text-sm text-gray-600">Phone</label>
                  <input
                    ref={refs.phone}
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    className={`w-full mt-1 px-4 py-2 border rounded-xl 
                      ${errors.phone ? "border-red-500" : ""}`}
                  />
                  {errors.phone && (
                    <p className="text-red-600 text-sm">{errors.phone}</p>
                  )}
                </div>

                {/* Postal Code */}
                <div>
                  <label className="text-sm text-gray-600">Postal Code</label>
                  <input
                    ref={refs.postalCode}
                    name="postalCode"
                    type="text"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="Postal Code"
                    className={`w-full mt-1 px-4 py-2 border rounded-xl 
                      ${errors.postalCode ? "border-red-500" : ""}`}
                  />
                  {errors.postalCode && (
                    <p className="text-red-600 text-sm">{errors.postalCode}</p>
                  )}
                </div>

                {/* Country */}
                <div>
                  <label className="text-sm text-gray-600">Country</label>
                  <select
                    ref={refs.country}
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className={`w-full mt-1 px-4 py-2 border rounded-xl
                      ${errors.country ? "border-red-500" : ""}`}
                  >
                    <option value="">Select Country</option>
                    {countries.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                  {errors.country && (
                    <p className="text-red-600 text-sm">{errors.country}</p>
                  )}
                </div>

                {/* Submit */}
                <div className="col-span-2">
                  <button
                    type="submit"
                    className="w-full mt-2 py-3 bg-brand-navy text-white rounded-xl hover:bg-brand-gold hover:text-brand-charcoal transition"
                  >
                    Sign Up
                  </button>
                </div>

              </form>

              <p className="text-center text-sm mt-4">
                Already have an account?{" "}
                <Link to="/login" className="text-brand-gold hover:underline">
                  Login
                </Link>
              </p>
            </div>
          </motion.div>
        </section>
      </div>

      {/* ⭐ LOADING OVERLAY */}
      {signupSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-md z-50">
          <div className="text-white text-2xl font-semibold animate-pulse">
            Creating your account...
          </div>
        </div>
      )}
    </>
  );
}
