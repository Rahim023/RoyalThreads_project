// controllers/signature.controller.js
import Signature from "../models/Signature.js";

export const getAllSignatures = async (req, res) => {
  try {
    const items = await Signature.find().sort({ createdAt: -1 }).lean();
    res.json(items);
  } catch (err) {
    console.error("getAllSignatures error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getSignatureById = async (req, res) => {
  const { id } = req.params;
  try {
    let item = null;
    // Try Mongo _id if appears to be 24 hex chars
    if (id && id.match && id.match(/^[0-9a-fA-F]{24}$/)) {
      item = await Signature.findById(id).lean();
    }
    // fallback: numeric id field
    if (!item) {
      const numeric = Number(id);
      if (!Number.isNaN(numeric)) {
        item = await Signature.findOne({ id: numeric }).lean();
      }
    }
    if (!item) return res.status(404).json({ message: "Signature not found" });
    res.json(item);
  } catch (err) {
    console.error("getSignatureById error:", err);
    res.status(500).json({ message: "Server error" });
  }
};export const getSignatureBySlug = async (req, res) => {
  const { slug } = req.params;

  try {
    const item = await Signature.findOne({ slug }).lean();
    if (!item) return res.status(404).json({ message: "Signature not found" });

    res.json(item);
  } catch (err) {
    console.error("getSignatureBySlug error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
