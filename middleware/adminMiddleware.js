// import User from "../models/User.js";

// const adminMiddleware = async (req, res, next) => {
//     const user = await User.findById(req.userId);
//     if (!user || !user.isAdmin) {
//         return res.status(403).json({ message: "Admin only" });
//     }
//     next();
// };

// export default adminMiddleware;

import User from "../models/User.js";

const adminMiddleware = async (req, res, next) => {
    try {
        // 🔴 CHANGE: req.userId comes from authMiddleware JWT
        const user = await User.findById(req.userId);

        // 🔴 CHANGE: check role instead of isAdmin
        if (!user || user.role !== "admin") {
            return res.status(403).json({ message: "Admin only" });
        }

        next();
    } catch (error) {
        console.error("Admin middleware error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export default adminMiddleware;

