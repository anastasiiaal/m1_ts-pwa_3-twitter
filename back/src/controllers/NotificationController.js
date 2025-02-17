const NotificationSubscription = require("../models/NotificationSubscription");
const User = require("../models/User");

module.exports = {
    // store or update a user's push subscription
    subscribe: async (req, res) => {
        try {
            const { endpoint, keys } = req.body;

            if (!req.user) {
                return res.status(401).json({ error: "Unauthorized" });
            }

            const existingSubscription = await NotificationSubscription.findOne({ where: { endpoint } });

            if (!existingSubscription) {
                await NotificationSubscription.create({
                    endpoint,
                    p256dh: keys.p256dh,
                    auth: keys.auth,
                    userId: req.user.id, // our current authentificated user
                });
            } else {
                console.log("Subscription already exists.");
            }

            res.status(200).json({ message: "Subscription saved." });
        } catch (error) {
            console.error("❌ Error saving subscription:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },

    // remove a user's subscription (e.g., when they unsubscribe)
    unsubscribe: async (req, res) => {
        try {
            const { endpoint } = req.body;

            if (!req.user) {
                return res.status(401).json({ error: "Unauthorized" });
            }

            await NotificationSubscription.destroy({
                where: { endpoint, userId: req.user.id },
            });

            res.status(200).json({ message: "Subscription removed." });
        } catch (error) {
            console.error("❌ Error removing subscription:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },

    // get all subscriptions for the logged-in user
    getSubscriptions: async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({ error: "Unauthorized" });
            }

            const subscriptions = await NotificationSubscription.findAll({
                where: { userId: req.user.id },
            });

            res.json(subscriptions);
        } catch (error) {
            console.error("❌ Error fetching subscriptions:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
};
