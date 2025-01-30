const { User } = require("../models");

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ error: "Unauthorized: No token provided" });
        }

        const tokenParts = authHeader.split(" ");
        if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
            return res.status(401).json({ error: "Invalid token format" });
        }

        const userToken = tokenParts[1];

        const user = await User.findOne({ where: { token: userToken } });
        console.log("Found user in DB:", user ? `ID: ${user.id}, Pseudo: ${user.pseudo}` : "❌ No user found");

        if (!user) {
            return res.status(401).json({ error: "Invalid token" });
        }

        req.user = user; // current user in req.user
        next();
    } catch (error) {
        console.error("Auth middleware error:", error);
        res.status(500).json({ error: "Authentication error" });
    }
};

module.exports = authMiddleware;
