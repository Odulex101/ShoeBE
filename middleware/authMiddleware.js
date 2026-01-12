// import jwt from "jsonwebtoken";

// const authMiddleware = (req, res, next) => {
//     const authHeader = req.headers.authorization;
//     if (!authHeader) return res.status(401).json({ message: "No token" });

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
    if (!authHeader) return res.status(401).json({ message: "No token" });

    try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 🔴 CHANGE: ATTACH USER OBJECT (NOT JUST ID)
        req.user = {
            id: decoded.userId,
            role: decoded.role
        };

        next();
    } catch {
        res.status(401).json({ message: "Unauthorized" });
    }
};

export default authMiddleware;

