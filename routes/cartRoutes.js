import express from "express";
import {
    addToCart,
    getCart,
    removeFromCart,
    updateCart,
} from "../controllers/cartController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", authMiddleware, addToCart);
router.get("/", authMiddleware, getCart);
router.delete("/:productId", authMiddleware, removeFromCart);
router.put("/:productId", authMiddleware, updateCart);

export default router;