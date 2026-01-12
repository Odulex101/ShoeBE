// import express from "express";
// import Review from "../models/Review.js";
// import authMiddleware from "../middleware/authMiddleware.js";

// const router = express.Router();

// /* GET PRODUCT REVIEWS */
// router.get("/:productId", async (req, res) => {
//     const reviews = await Review.find({
//         productId: Number(req.params.productId),
//     });
//     res.json(reviews);
// });

// /* POST REVIEW */
// router.post("/", authMiddleware, async (req, res) => {
//     const { productId, text } = req.body;

//     const review = await Review.create({
//         productId,
//         text,
//         userId: req.userId,
//     });

//     res.status(201).json(review);
// });

// export default router;

// import express from "express";
// import Review from "../models/Review.js";
// import authMiddleware from "../middleware/authMiddleware.js";

// const router = express.Router();

// /* GET REVIEWS BY PRODUCT */
// router.get("/:productId", async (req, res) => {
//     try {
//         const reviews = await Review.find({
//             productId: Number(req.params.productId)
//         }).sort({ createdAt: -1 });

//         res.json(reviews);
//     } catch {
//         res.status(500).json({ message: "Failed to load reviews" });
//     }
// });

// /* POST REVIEW (AUTH ONLY) */
// router.post("/", authMiddleware, async (req, res) => {
//     try {
//         const { productId, rating, title, content, userName, images } = req.body;

//         const review = await Review.create({
//             productId,
//             rating,
//             title,
//             content,
//             userName,
//             images,
//             userId: req.userId
//         });

//         res.status(201).json(review);
//     } catch {
//         res.status(400).json({ message: "Failed to submit review" });
//     }
// });

// export default router;

/* GET REVIEWS BY PRODUCT */
router.get("/:productId", async (req, res) => {
    try {
        const productId = Number(req.params.productId);

        if (isNaN(productId)) {
            return res.status(400).json({ message: "Invalid productId" });
        }

        const reviews = await Review.find({ productId }).sort({ createdAt: -1 });

        // Always return an array
        res.json(Array.isArray(reviews) ? reviews : []);
    } catch (err) {
        console.error("GET REVIEWS ERROR:", err);
        res.status(500).json({ message: "Failed to load reviews" });
    }
});




