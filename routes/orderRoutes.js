// import express from "express";
// import authMiddleware from "../middleware/authMiddleware.js";
// import Order from "../models/Order.js";
// import Cart from "../models/Cart.js";

// const router = express.Router();

// /* ===============================
//    CREATE ORDER
// =============================== */
// router.post("/", authMiddleware, async (req, res) => {
//     try {
//         const { delivery, paymentMethod, coupon } = req.body;

//         const cart = await Cart.findOne({ userId: req.userId });

//         if (!cart || cart.items.length === 0) {
//             return res.status(400).json({ message: "Cart is empty" });
//         }

//         if (
//             !delivery ||
//             !delivery.fullName ||
//             !delivery.address ||
//             !delivery.phone
//         ) {
//             return res.status(400).json({ message: "Delivery details required" });
//         }

//         // ✅ REQUIRED DELIVERY DATE RANGE
//         const deliveryDateRange = {
//             start: new Date(),
//             end: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
//         };

//         const totalAmount = cart.items.reduce(
//             (sum, item) => sum + item.price * item.quantity * 950,
//             0
//         );

//         const order = await Order.create({
//             userId: req.userId,
//             items: cart.items,
//             delivery,
//             paymentMethod: paymentMethod || "Pay on Delivery (Bank Transfer)",
//             deliveryDateRange,
//             coupon,
//             totalAmount,
//         });

//         // ✅ CLEAR CART AFTER ORDER
//         cart.items = [];
//         await cart.save();

//         res.status(201).json(order);
//     } catch (error) {
//         console.error("ORDER CREATION ERROR:", error);
//         res.status(500).json({ message: "Failed to create order" });
//     }
// });

// /* ===============================
//    GET USER ORDERS
// =============================== */
// router.get("/", authMiddleware, async (req, res) => {
//     try {
//         const orders = await Order.find({ userId: req.userId }).sort({
//             createdAt: -1,
//         });
//         res.json(orders);
//     } catch (error) {
//         console.error("FETCH ORDERS ERROR:", error);
//         res.status(500).json({ message: "Failed to fetch orders" });
//     }
// });

// export default router;

import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import User from "../models/User.js";
import { sendOrderConfirmationEmail } from "../utils/sendEmail.js";

const router = express.Router();

/* ===============================
   CREATE ORDER
=============================== */
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { delivery, paymentMethod, coupon } = req.body;

        // 🔹 Fetch user & cart
        const cart = await Cart.findOne({ userId: req.userId });
        const user = await User.findById(req.userId);

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        if (
            !delivery ||
            !delivery.fullName ||
            !delivery.address ||
            !delivery.phone ||
            !delivery.pickupStation
        ) {
            return res.status(400).json({
                message: "Delivery details and pickup station are required",
            });
        }

        // 🔹 Delivery date range
        const deliveryDateRange = {
            start: new Date(),
            end: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        };

        // 🔹 Calculate total
        const totalAmount = cart.items.reduce(
            (sum, item) => sum + item.price * item.quantity * 950,
            0
        );

        // 🔹 Create order
        const order = await Order.create({
            userId: req.userId,
            items: cart.items,
            delivery,
            paymentMethod: paymentMethod || "Pay on Delivery (Bank Transfer)",
            deliveryDateRange,
            coupon,
            totalAmount,
        });

        // 🔹 Clear cart
        cart.items = [];
        await cart.save();

        // 📧 Send order confirmation email
        if (user?.email) {
            await sendOrderConfirmationEmail({
                to: user.email,
                pickupStation: delivery.pickupStation,
                totalAmount,
            });
        }

        // 📱 SMS placeholder (Twilio-ready)
        console.log(
            `SMS to ${delivery.phone}: Your order was successful. Pickup at ${delivery.pickupStation}`
        );

        res.status(201).json(order);
    } catch (error) {
        console.error("ORDER CREATION ERROR:", error);
        res.status(500).json({ message: "Failed to create order" });
    }
});

/* ===============================
   GET USER ORDERS
=============================== */
router.get("/", authMiddleware, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.userId }).sort({
            createdAt: -1,
        });

        res.json(orders);
    } catch (error) {
        console.error("FETCH ORDERS ERROR:", error);
        res.status(500).json({ message: "Failed to fetch orders" });
    }
});

export default router;





