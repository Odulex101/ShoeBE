import express from "express";
import Order from "../models/Order.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
    const orders = await Order.find().populate("userId", "email");
    res.json(orders);
});

router.put("/:id/status", authMiddleware, adminMiddleware, async (req, res) => {
    const order = await Order.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true }
    );
    res.json(order);
});

export default router;
