import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

const auth = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId || decoded.id;
    next();
};

router.get("/me", auth, async (req, res) => {
    const user = await User.findById(req.userId);
    res.json(user);
});

router.put("/me", auth, async (req, res) => {
    const user = await User.findByIdAndUpdate(
        req.userId,
        req.body,
        { new: true }
    );
    res.json(user);
});

export default router;







