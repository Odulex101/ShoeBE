
// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//     {
//         email: { type: String, unique: true, required: true },
//         fullName: String,
//         dateOfBirth: Date,
//         verificationCode: String,
//         codeExpires: Date,

//         verified: { type: Boolean, default: false }
//     },
//     { timestamps: true }
// );

// export default mongoose.model("User", userSchema);


import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: { type: String, unique: true, required: true },
        fullName: String,
        dateOfBirth: Date,
        verificationCode: String,
        codeExpires: Date,

        verified: { type: Boolean, default: false },

        // 🔴 CHANGE: ADD ROLE FOR ADMIN SYSTEM
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        }
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema);




