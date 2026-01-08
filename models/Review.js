// import mongoose from "mongoose";

// const reviewSchema = new mongoose.Schema(
//     {
//         productId: { type: Number, required: true },
//         userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//         text: { type: String, required: true },
//     },
//     { timestamps: true }
// );

// export default mongoose.model("Review", reviewSchema);

import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        productId: {
            type: Number,
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        userName: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: true
        },
        title: String,
        content: String,
        images: [String]
    },
    { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);

