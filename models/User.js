
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: { type: String, unique: true, required: true },
        fullName: String,
        dateOfBirth: Date,
        verificationCode: String,
        codeExpires: Date,

        verified: { type: Boolean, default: false }
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema);




