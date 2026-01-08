import express from "express";
import Cart from "../models/Cart.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* GET CART */
router.get("/", authMiddleware, async (req, res) => {
    let cart = await Cart.findOne({ userId: req.userId });

    if (!cart) {
        cart = await Cart.create({ userId: req.userId, items: [] });
    }

    res.json(cart);
});

/* ADD ITEM */
router.post("/add", authMiddleware, async (req, res) => {
    const { product } = req.body;

    if (!product || product.price == null) {
        return res.status(400).json({ message: "Product price is missing" });
    }

    let cart = await Cart.findOne({ userId: req.userId });

    const cleanProduct = {
        productId: Number(product.productId),
        name: product.name,
        price: Number(product.price),
        image: product.image,
        quantity: 1,
    };

    if (!cart) {
        cart = new Cart({
            userId: req.userId,
            items: [cleanProduct],
        });
    } else {
        const existing = cart.items.find(
            item => item.productId === cleanProduct.productId
        );

        if (existing) {
            existing.quantity += 1;
        } else {
            cart.items.push(cleanProduct);
        }
    }

    await cart.save();
    res.json(cart);
});

/* REMOVE ITEM */
router.delete("/:productId", authMiddleware, async (req, res) => {
    const cart = await Cart.findOne({ userId: req.userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
        item => item.productId !== Number(req.params.productId)
    );

    await cart.save();
    res.json(cart);
});

/* UPDATE QUANTITY */
router.put("/update", authMiddleware, async (req, res) => {
    const { productId, quantity } = req.body;

    if (quantity < 1) {
        return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const cart = await Cart.findOne({ userId: req.userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.map(item =>
        item.productId === productId
            ? { ...item, quantity }
            : item
    );

    await cart.save();
    res.json(cart);
});

export default router;

