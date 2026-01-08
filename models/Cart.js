import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        items: [
            {
                productId: Number,
                name: String,
                price: Number,
                image: String,
                quantity: { type: Number, default: 1 },
            },
        ],
    },
    { timestamps: true }
);

export default mongoose.model("Cart", cartSchema);
