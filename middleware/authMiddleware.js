// import jwt from "jsonwebtoken";

// const authMiddleware = (req, res, next) => {
//     const authHeader = req.headers.authorization;

//     if (!authHeader) {
//         return res.status(401).json({ message: "No token" });
//     }

//     try {
//         const token = authHeader.split(" ")[1];
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         req.userId = decoded.userId;
//         next();
//     } catch {
//         res.status(401).json({ message: "Unauthorized" });
//     }
// };

// export default authMiddleware;



import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token" });
    }

    try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // ✅ SUPPORT ALL COMMON JWT PAYLOAD SHAPES
        const userId =
            decoded.id ||
            decoded._id ||
            decoded.userId;

        if (!userId) {
            return res.status(401).json({ message: "Invalid token payload" });
        }

        // ✅ STANDARDIZE
        req.user = { id: userId };

        next();
    } catch (err) {
        console.error("AUTH ERROR:", err);
        return res.status(401).json({ message: "Unauthorized" });
    }
};

export default authMiddleware;



