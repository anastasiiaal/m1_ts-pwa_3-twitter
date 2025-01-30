const { User } = require("../models");

const authMiddleware = async (req, res, next) => {
    const userToken = req.headers.authorization;

    if (!userToken) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await User.findOne({ where: { token: userToken } });

    if (!user) {
        return res.status(401).json({ error: "Invalid token" });
    }

    req.user = user; // current user in req.user
    next();
};

module.exports = authMiddleware;
