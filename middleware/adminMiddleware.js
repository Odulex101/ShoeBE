import User from "../models/User.js";

const adminMiddleware = async (req, res, next) => {
    const user = await User.findById(req.userId);

    if (!user || !user.isAdmin) {
        return res.status(403).json({ message: "Admin only" });
    }

    next();
};

export default adminMiddleware;

