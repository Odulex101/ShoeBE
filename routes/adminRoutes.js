// routes/adminRoutes.js
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";

const router = express.Router();

// 🔴 PROTECT ALL ADMIN ROUTES
router.use(authMiddleware, adminMiddleware);

// Dashboard stats
router.get("/dashboard", async (req, res) => {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalRevenueAgg = await Order.aggregate([{ $group: { _id: null, total: { $sum: "$totalAmount" } } }]);
    const totalRevenue = totalRevenueAgg[0]?.total || 0;
    res.json({ totalUsers, totalOrders, totalRevenue });
});

// Orders
router.get("/orders", async (req, res) => {
    const orders = await Order.find().sort({ createdAt: -1 }).limit(req.query.limit || 0).populate("userId", "email");
    res.json(orders);
});

// Users
router.get("/users", async (req, res) => {
    const users = await User.find();
    res.json(users);
});

router.put("/users/:id", async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.isAdmin = !user.isAdmin;
    await user.save();
    res.json(user);
});

// Products CRUD (assuming Product model exists)
router.get("/products", async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

router.post("/products", async (req, res) => {
    const product = await Product.create(req.body);
    res.json(product);
});

router.delete("/products/:id", async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});

export default router;
