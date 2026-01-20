// import express from "express";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import cors from "cors";

// import authRoutes from "./routes/authRoutes.js";
// import cartRoutes from "./routes/cartRoutes.js";
// import reviewRoutes from "./routes/reviewRoutes.js";
// import orderRoutes from "./routes/orderRoutes.js";
// import adminOrderRoutes from "./routes/adminOrderRoutes.js";
// import customerCareRoutes from "./routes/customerCareRoutes.js";

// dotenv.config();

// const app = express();

// // ==================== CORS CONFIG ====================
// const allowedOrigins = [
//     "http://localhost:5173",           // dev frontend
//     "https://shoe-fe.vercel.app"       // prod frontend
// ];

// app.use(cors({
//     origin: function (origin, callback) {
//         if (!origin) return callback(null, true); // allow non-browser tools
//         if (allowedOrigins.indexOf(origin) === -1) {
//             const msg = `The CORS policy does not allow access from the origin ${origin}.`;
//             return callback(new Error(msg), false);
//         }
//         return callback(null, true);
//     },
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true
// }));

// // ==================== MIDDLEWARE ====================
// app.use(express.json()); // parse JSON requests

// // ==================== ROUTES ====================
// app.use("/api/auth", authRoutes);
// app.use("/api/cart", cartRoutes);
// app.use("/api/reviews", reviewRoutes);
// app.use("/api/orders", orderRoutes);
// app.use("/api/admin/orders", adminOrderRoutes);
// app.use("/api/customer-care", customerCareRoutes);

// app.get("/", (req, res) => res.send("API running ✅"));

// // ==================== MONGODB CONNECT ====================
// const PORT = process.env.PORT || 5000;

// mongoose
//     .connect(process.env.MONGO_URI, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true
//     })
//     .then(() => {
//         console.log("✅ MongoDB connected successfully");
//         app.listen(PORT, () => {
//             console.log(`🚀 Server running on http://localhost:${PORT}`);
//         });
//     })
//     .catch(err => {
//         console.error("❌ MongoDB connection error:", err);
//         process.exit(1);
//     });

// export default app;


import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminOrderRoutes from "./routes/adminOrderRoutes.js";
import customerCareRoutes from "./routes/customerCareRoutes.js";

dotenv.config();

const app = express();

// ==================== CORS CONFIG ====================
// Updated to allow localhost dev, all Vercel frontend URLs (including previews), and server-to-server calls
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true); // allow server-to-server or Postman requests
        if (
            origin.startsWith("http://localhost:") ||  // dev frontend
            origin.endsWith(".vercel.app")             // production & preview frontend URLs
        ) {
            return callback(null, true);
        }
        return callback(new Error(`The CORS policy does not allow access from ${origin}`));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

// ==================== MIDDLEWARE ====================
app.use(express.json()); // parse JSON requests

// ==================== ROUTES ====================
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin/orders", adminOrderRoutes);
app.use("/api/customer-care", customerCareRoutes);

app.get("/", (req, res) => res.send("API running ✅"));

// ==================== MONGODB CONNECT ====================
const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("✅ MongoDB connected successfully");
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1);
    });

export default app;
