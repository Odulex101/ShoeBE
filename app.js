import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import app from "./app.js";

dotenv.config();

/* =============================== DEBUGGING ENVIRONMENT VARIABLES =============================== */
console.log("Current directory:", process.cwd());
console.log(".env file exists:", fs.existsSync(".env"));
console.log("EMAIL_USER after config:", process.env.EMAIL_USER);
console.log("MONGO_URI exists:", !!process.env.MONGO_URI);
console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);

/* =============================== CONNECT TO MONGODB =============================== */
const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("✅ MongoDB connected successfully");

        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1);
    });



