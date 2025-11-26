import Signature from "../models/Signature.js";

export const getAllSignatures = async (req, res) => {
  try {
    const items = await Signature.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getSignatureById = async (req, res) => {
  try {
    const item = await Signature.findOne({ id: req.params.id });
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
