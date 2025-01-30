const bcrypt = require("bcrypt");
const { User } = require("../models");
const crypto = require("crypto"); // to generate unique token when logged in

const AuthController = {
    register: async (req, res) => {
        try {
            const { pseudo, email, password } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await User.create({ pseudo, email, password: hashedPassword });
            res.status(201).json({ message: "User created. You can now login." });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ where: { email } });
            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(401).json({ error: "Invalid credentials" });
            }

            // generate uniue token
            const userToken = crypto.randomBytes(32).toString("hex");

            user.token = userToken;
            await user.save();

            res.json({ token: userToken, user });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    logout: async (req, res) => {
        try {
            const { token } = req.body;
            const user = await User.findOne({ where: { token } });
            if (!user) return res.status(401).json({ error: "Invalid token" });

            user.token = null; // delete token
            await user.save();

            res.json({ message: "Logged out successfully" });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
};

module.exports = AuthController;
