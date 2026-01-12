import Cart from "../models/Cart.js";
import mongoose from "mongoose";

export const getCart = async (req, res) => {
    try {
        const userId = req.user.id;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const cart = await Cart.findOneAndUpdate(
            { userId: new mongoose.Types.ObjectId(userId) },
            { $setOnInsert: { items: [] } },
            { new: true, upsert: true }
        );
        res.json(cart);
    } catch (err) {
        console.error("GET CART ERROR:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { product } = req.body;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        if (
            !product ||
            product.productId == null ||
            product.price == null ||
            isNaN(Number(product.productId)) ||
            isNaN(Number(product.price))
        ) {
            return res.status(400).json({ message: "Invalid product data" });
        }

        const cleanProduct = {
            productId: Number(product.productId),
            name: product.name || "Unnamed Product",
            price: Number(product.price),
            image: product.image || "",
            quantity: 1,
        };

        let cart = await Cart.findOne({ userId: new mongoose.Types.ObjectId(userId) });

        if (!cart) {
            cart = new Cart({
                userId: new mongoose.Types.ObjectId(userId),
                items: [cleanProduct],
            });
        } else {
            const existing = cart.items.find(
                (item) => item.productId === cleanProduct.productId
            );

            if (existing) {
                existing.quantity += 1;
            } else {
                cart.items.push(cleanProduct);
            }
        }

        await cart.save();
        res.json(cart);
    } catch (err) {
        console.error("ADD TO CART ERROR:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const productId = Number(req.params.productId);

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        if (isNaN(productId)) {
            return res.status(400).json({ message: "Invalid productId" });
        }

        const cart = await Cart.findOne({ userId: new mongoose.Types.ObjectId(userId) });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.items = cart.items.filter(
            (item) => item.productId !== productId
        );

        await cart.save();
        res.json(cart);
    } catch (err) {
        console.error("REMOVE FROM CART ERROR:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity } = req.body;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        if (
            productId == null ||
            isNaN(Number(productId)) ||
            quantity == null ||
            isNaN(Number(quantity)) ||
            quantity < 1
        ) {
            return res
                .status(400)
                .json({ message: "Invalid productId or quantity" });
        }

        const cart = await Cart.findOne({ userId: new mongoose.Types.ObjectId(userId) });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        let found = false;

        cart.items = cart.items.map((item) => {
            if (item.productId === Number(productId)) {
                found = true;
                return { ...item.toObject(), quantity: Number(quantity) };
            }
            return item;
        });

        if (!found) {
            return res
                .status(404)
                .json({ message: "Product not found in cart" });
        }

        await cart.save();
        res.json(cart);
    } catch (err) {
        console.error("UPDATE CART ERROR:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};