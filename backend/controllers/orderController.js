import Order from "../models/orders.js";

export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, totalINR } = req.body;

    const order = await Order.create({
      user: userId,
      items,
      totalINR,
      status: "Ordered"
    });

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    const order = await Order.findOne({
      _id: req.params.id,
      user: userId
    });

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const reason = req.body.reason || "No reason provided";

    const updated = await Order.findOneAndUpdate(
      { _id: req.params.id, user: userId },
      {
        status: "Cancelled",
        cancelledReason: reason,
        cancelledAt: new Date()
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    await Order.findOneAndDelete({
      _id: req.params.id,
      user: userId
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
